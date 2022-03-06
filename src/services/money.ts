import type { Rate, Money } from "../types";

export function convertMoney(
  amount: Money,
  baseRateInUSD: Rate,
  destRateInUSD: Rate
): Money {
  const convertedPrice = amount * (1 / baseRateInUSD) * destRateInUSD;
  return convertedPrice;
}

export function amountFormatter(amount: Money) {
  return amount === 0 ? "0" : Number.isNaN(amount) ? "" : amount.toFixed(2);
}

export function convertAndFormat(input: string, baseRate: Rate, destRate: Rate) {
  const convertedAmount = convertMoney(Number.parseFloat(input), baseRate, destRate);

  const convertedAmountFormatted = amountFormatter(convertedAmount);
  return convertedAmountFormatted;
}
