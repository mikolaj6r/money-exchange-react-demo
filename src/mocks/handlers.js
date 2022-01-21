// src/mocks/handlers.js
import { rest } from "msw";
import ratesResponse from "./ratesResponse.json";
import currenciesResponse from "./currenciesResponse.json";
import userResponse from "./userResponse.json";

function moneyConverter(amount, baseRateInUSD, destRateInUSD) {
  const convertedPrice = amount * (1 / baseRateInUSD) * destRateInUSD;
  return convertedPrice;
}

async function fetchRatesOnline(ctx) {
  const response = await ctx.fetch(
    `https://openexchangerates.org/api/latest.json?app_id=${process.env.REACT_APP_API_ID}`
  );
  const responseData = await response.json();
  return responseData;
}

function fetchRatesMock() {
  return ratesResponse;
}

function fetchRates(ctx) {
  if (process.env.NODE_ENV === "test") return fetchRatesMock();
  else return fetchRatesOnline(ctx);
}

export const handlers = [
  rest.get("/api/latest", async (req, res, ctx) => {
    // Perform an original request to the intercepted request URL
    const originalResponseData = await fetchRates(ctx);

    const base = req.url.searchParams.get("base") || "USD";
    const { rates, isMockData = false } = originalResponseData;
    const baseRate = rates[base];

    if (!baseRate) return res(ctx.json({ error: "Wrong BASE provided." }));

    const newRates = Object.entries(rates).reduce((acc, entry) => {
      const [currency, rate] = entry;
      const convertedRate = moneyConverter(1, baseRate, rate);

      acc[currency] = convertedRate;

      return acc;
    }, {});

    return res(
      ctx.json({ base, isMockData, rates: newRates, timestamp: Date.now() })
    );
  }),

  rest.get("/api/convert/:value/:from/:to", async (req, res, ctx) => {
    const originalResponseData = await fetchRates(ctx);

    const { value, from, to } = req.params;
    const { rates, isMockData = false } = originalResponseData;
    const fromRate = rates[from];
    const toRate = rates[to];

    if (!fromRate || !toRate || !value)
      return res(ctx.json({ error: "Too few params provided." }));

    const rate = moneyConverter(1, fromRate, toRate);
    const convertedAmount = moneyConverter(value, fromRate, toRate);

    return res(
      ctx.json({
        isMockData,
        request: {
          query: req.url.pathname,
          amount: value,
          from,
          to,
        },
        meta: {
          timestamp: Date.now(),
          rate,
        },
        response: convertedAmount,
      })
    );
  }),
  rest.get("/api/me", async (req, res, ctx) => {
    return res(ctx.json(userResponse));
  }),
  rest.get("/api/currencies", async (req, res, ctx) => {
    return res(ctx.json(currenciesResponse));
  }),
];
