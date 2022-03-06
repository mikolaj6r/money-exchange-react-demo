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
    if (!sessionStorage.getItem("userData")) {
      sessionStorage.setItem("userData", JSON.stringify(userResponse));
    }

    return res(ctx.json(JSON.parse(sessionStorage.getItem("userData"))));
  }),

  rest.post("/api/me/accounts/:currency", async (req, res, ctx) => {
    const { currency } = req.params;
    const userData = JSON.parse(sessionStorage.getItem("userData"));

    const doesAccountExist = userData.accounts.some(
      (account) => account.currency === currency
    );

    if (!doesAccountExist) userData.accounts.push({ currency, balance: 0 });

    sessionStorage.setItem("userData", JSON.stringify(userData));

    return res(ctx.status(200), ctx.body("OK"));
  }),
  /*
  interface ConvertProps {
    from: string;
    to: string;
    amount: string;
    rate: number;
  }
  */
  rest.post("/api/me/convert", async (req, res, ctx) => {
    const data = req.body;
    const userData = JSON.parse(sessionStorage.getItem("userData"));

    const fromAccount = userData.accounts.find(
      (account) => account.currency === data.from
    );
    const toAccount = userData.accounts.find(
      (account) => account.currency === data.to
    );

    if (!fromAccount || !toAccount)
      return res(
        ctx.text(
          "Converting error - Cannot find accounts with provided currencies"
        )
      );
    if (fromAccount.balance < Number.parseFloat(data.amount))
      return res(
        ctx.text("Converting error - Balance on source account is too low")
      );

    const convertedAmount = data.amount * data.rate;

    // do actual mutations
    fromAccount.balance -= Number.parseFloat(data.amount);
    toAccount.balance += convertedAmount;

    sessionStorage.setItem("userData", JSON.stringify(userData));

    return res(ctx.text("OK"));
  }),
  rest.get("/api/currencies", async (req, res, ctx) => {
    return res(ctx.json(currenciesResponse));
  }),
];
