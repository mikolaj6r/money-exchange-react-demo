import type { Account, Currency } from "../types";

type TemporaryAccount = Account & { isTemporary: true };
type AccountsUnion = Account | TemporaryAccount;

export function getTemporaryAccount(
  activeCurrency: string,
  allCurrencies: Array<Currency>,
  allUserAccounts: Array<Account>
): AccountsUnion {
  const filteredUserAccounts = allUserAccounts.filter(
    (account) => account.currency !== activeCurrency
  );

  if (filteredUserAccounts.length > 0) return filteredUserAccounts[0];

  const filteredCurrencies = allCurrencies.filter(
    (currency) => currency.shortcut !== activeCurrency
  );

  const firstAvailableCurrency = filteredCurrencies[0];

  if (!firstAvailableCurrency)
    throw new Error("Too few currencies in the system.");
    
  return getUserAccountOrCreate(
    firstAvailableCurrency.shortcut,
    filteredUserAccounts
  );
}

export function getUserAccountOrCreate(
  currencyShortcut: string,
  userAccounts: Array<Account>
): AccountsUnion {
  const userAccount = userAccounts.find(
    (account) => account.currency === currencyShortcut
  );

  return (
    userAccount || {
      currency: currencyShortcut,
      balance: 0,
      isTemporary: true,
    }
  );
}

export type { TemporaryAccount, AccountsUnion };
