type Currency = {
  fullName: string;
  shortcut: string;
  symbol: string;
}

type Money = number;

type Account = {
  currency: Currency["shortcut"];
  balance: Money;
}

type User = {
  id: string;
  accounts: Array<Account>;
}

type Rate = number;

type Rates = {
  [rate: string]: Rate
};

type ConvertProps = {
  from: Currency["shortcut"];
  to: Currency["shortcut"];
  amount: string;
  rate: Rate;
}

export type { Currency, User, Account, Money, Rates, Rate, ConvertProps };
