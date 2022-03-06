import React, { useRef } from "react";

import { useQuery, useMutation, useQueryClient, UseMutationResult } from "react-query";

import * as apiService from "../services/api";

import {
  getTemporaryAccount,
} from "../services/accounts";

import type { AccountsUnion } from "../services/accounts";
import type { Account, Currency, Rates, ConvertProps } from "../types";

type UseExchangeResult =
  | { status: "error" }
  | { status: "loading" }
  | {
      status: "success";
      fromCurrency: Currency;
      toCurrency: Currency;
      rates: Rates;
      checkBalanceExceeded: (amount: string) => boolean;
      activeAccounts: React.MutableRefObject<{
        source: Account | null;
        destination: AccountsUnion | null;
      }>;
      availableCurrencies: Array<Currency>;
      userAccounts: Array<Account>;
      sendExchangeRequest: UseMutationResult<
        void,
        unknown,
        ConvertProps
      >["mutate"];
      createAccount: UseMutationResult<void, unknown, string>["mutate"];
    };

export default function useExchange(): UseExchangeResult {
  // Application State / Business logic
  // server-side data
  const queryClient = useQueryClient();
  const currencies = useQuery("currencies", apiService.getCurrencies);
  const ratesQuery = useQuery("rates", apiService.getRates, {
    // Refetch the data every 10s
    refetchInterval: 1000 * 10, // interval in ms so 1s * x
  });
  const user = useQuery("user", apiService.getUser);

  const createAccount = useMutation(apiService.createAccount, {
    onSuccess: () => {
      queryClient.invalidateQueries("user");
    },
  });

  const sendExchangeRequest = useMutation(apiService.sendExchangeRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries("user");
    },
  });

  // STATE LOGIC
  const activeAccounts = useRef<{
    source: Account | null;
    destination: AccountsUnion | null;
  }>({
    source: null,
    destination: null,
  });


  // DERIVED/COMPUTED LOGIC
  if(user.isIdle || currencies.isIdle || ratesQuery.isIdle){
    throw new Error("Queries should start immediately");
  }

  if (user.isError || currencies.isError || ratesQuery.isError)
    return { status: "error"};
  else if (user.isLoading || currencies.isLoading || ratesQuery.isLoading)
    return { status: "loading"};

  const { accounts: userAccounts } = user.data;
  const availableCurrencies = currencies.data;
  const rates = ratesQuery.data;

  // select accounts that would be shown
  if (!activeAccounts.current.source)
    activeAccounts.current.source = userAccounts[0]; // user must have at least one account

  if (!activeAccounts.current.destination) {
    // now either select user's second account or one of available currencies
    activeAccounts.current.destination =
      userAccounts.length > 1
        ? userAccounts[1]
        : getTemporaryAccount(
            userAccounts[0].currency,
            availableCurrencies,
            userAccounts
          );
  }

  // check for stale data and update if needed;
  const updatedFromAccount = userAccounts.find(
    (account) => account.currency === activeAccounts.current.source?.currency
  );
  const updatedToAccount = userAccounts.find(
    (account) => account.currency === activeAccounts.current.destination?.currency
  );

  if (
    updatedFromAccount &&
    updatedFromAccount.balance !== activeAccounts.current.source.balance
  ) {
    activeAccounts.current.source = updatedFromAccount;
  }
  if (
    updatedToAccount &&
    updatedToAccount?.balance !== activeAccounts.current.source?.balance
  ) {
    activeAccounts.current.destination = updatedToAccount;
  }

  const fromCurrency = availableCurrencies.find(
    (currency) => currency.shortcut === activeAccounts.current.source?.currency
  );
  const toCurrency = availableCurrencies.find(
    (currency) => currency.shortcut === activeAccounts.current.destination?.currency
  );

  if (!fromCurrency || !toCurrency) return { status: "error" };

  const checkBalanceExceeded = (amount: string) =>  {
    if(!activeAccounts.current.source) throw new Error("No FROM account");

    return activeAccounts.current.source?.balance < Number.parseFloat(amount);
  };

  return {
    status: "success",
    fromCurrency,
    toCurrency,
    rates,
    checkBalanceExceeded,
    activeAccounts,
    availableCurrencies,
    userAccounts,
    createAccount: createAccount.mutate,
    sendExchangeRequest: sendExchangeRequest.mutate
  };
}
