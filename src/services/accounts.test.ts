import { getTemporaryAccount, getUserAccountOrCreate } from "./accounts";
import type { Account, Currency } from "../types";

function getTestData() {
  const currencies: Array<Currency> = [
    {
      fullName: "Polish Zloty",
      shortcut: "PLN",
      symbol: "zł",
    },
    {
      fullName: "Euro",
      shortcut: "EUR",
      symbol: "€",
    },
    {
      fullName: "Pound sterling",
      shortcut: "GBP",
      symbol: "£",
    }
  ];

  const accounts: Array<Account> = [
    {
      currency: "PLN",
      balance: 1000,
    },
    {
      currency: "EUR",
      balance: 100,
    },
  ];

  return {currencies, accounts}
}

test("getTemporaryAccount", () => {
  const {currencies, accounts} = getTestData();

  const plnAccount = accounts.find(account => account.currency === 'PLN') as Account;
  const eurAccount = accounts.find(account => account.currency === 'EUR') as Account;
  
  expect(getTemporaryAccount("PLN", [], accounts)).toBe(eurAccount);
  expect(getTemporaryAccount("PLN", [], accounts)).not.toBe(plnAccount);

  expect(() => {getTemporaryAccount("PLN", [], [plnAccount])}).toThrow();

  const firstCurrency = currencies[0];

  expect(getTemporaryAccount("XYZ", [firstCurrency], [])).toEqual({
    currency: firstCurrency.shortcut,
    balance: 0,
    isTemporary: true,
  });
});

test("getUserAccountOrCreate", () => {
  const {currencies, accounts} = getTestData();

  const plnAccount = accounts.find(account => account.currency === 'PLN');

  expect(getUserAccountOrCreate("PLN", accounts)).toBe(plnAccount);

  expect(getUserAccountOrCreate("XYZ", accounts)).toEqual({
    currency: "XYZ",
    balance: 0,
    isTemporary: true,
  })
});