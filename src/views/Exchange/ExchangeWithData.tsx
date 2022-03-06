import React, { useState } from "react";

import { ExchangeIcon } from "../../components/icons";
import Layout from "../../components/Layout";
import CurrenciesModal from "../../components/CurrenciesModal";
import ConvertedMoneyModal from "../../components/ConvertedMoneyModal";

import useExchange from "../../hooks/useExchange";

import { convertMoney, convertAndFormat } from "../../services/money";
import { isInputValid } from "../../services/validators";
import {
  getTemporaryAccount,
  getUserAccountOrCreate,
} from "../../services/accounts";

import {
  SubmitButton,
  Field,
  ChangeCurrencyBtn,
  ExchangeInput,
} from "./Exchange.styled";

type UseExchangeResultSuccess = Extract<
  ReturnType<typeof useExchange>,
  { status: "success" }
>;

interface ExchangeWithDataProps {
  exchangeData: UseExchangeResultSuccess;
}

export default function ExchangeWithData({
  exchangeData
}: ExchangeWithDataProps) {
  const [amounts, setAmounts] = useState({ source: "", destination: "" });

  const [currenciesModalData, setCurrenciesModalData] =
    useState<"source" | "destination" | null>(null);
  const [lastConvertedData, setLastConvertedData] =
    useState<null | { from: string; to: string }>(null);

  const {
    createAccount,
    sendExchangeRequest,
    checkBalanceExceeded,
    rates,
    toCurrency,
    fromCurrency,
    userAccounts,
    activeAccounts,
    availableCurrencies,
  } = exchangeData;

  // computed
  const fromRate = rates[fromCurrency.shortcut];
  const toRate = rates[toCurrency.shortcut];

  const exchangeRate = convertMoney(1, fromRate, toRate);

  const dataForCurrenciesModal = availableCurrencies.map((currency) => {
    const balance = userAccounts.find(
      (account) => currency.shortcut === account.currency
    )?.balance;

    return {
      ...currency,
      balance,
    };
  });

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !amounts.source ||
      !amounts.destination ||
      !fromCurrency ||
      !toCurrency ||
      checkBalanceExceeded(amounts.source)
    )
      return;

    sendExchangeRequest({
      from: fromCurrency.shortcut,
      to: toCurrency.shortcut,
      amount: amounts.source,
      rate: Number.parseFloat(amounts.destination) / Number.parseFloat(amounts.source),
    });

    setLastConvertedData({
      from: `${fromCurrency.symbol}${amounts.source}`,
      to: `${toCurrency.symbol}${amounts.destination}`,
    });
    setAmounts({ source: "", destination: "" });
  }

  function onChangeFromAmount(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget.value;

    if (!isInputValid(input)) return;

    setAmounts({
      source: input,
      destination: convertAndFormat(input, fromRate, toRate),
    });
  }

  function onChangeToAmount(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget.value;

    if (!isInputValid(input)) return;

    setAmounts({
      source: convertAndFormat(input, toRate, fromRate),
      destination: input,
    });
  }

  function onCurrencySwitch(chosenCurrency?: string) {
    if (!chosenCurrency) return setCurrenciesModalData(null);

    const targetedAccountKey = currenciesModalData;
    const secondAccountKey = currenciesModalData === "source" ? "destination" : "source";

    if (!targetedAccountKey) return;

    activeAccounts.current[targetedAccountKey] = getUserAccountOrCreate(
      chosenCurrency,
      userAccounts
    );

    if (activeAccounts.current[secondAccountKey]?.currency === chosenCurrency) {
      activeAccounts.current[secondAccountKey] = getTemporaryAccount(
        chosenCurrency,
        availableCurrencies,
        userAccounts
      );
    }

    setAmounts({ source: "", destination: "" });
    setCurrenciesModalData(null);
    createAccount(chosenCurrency);
  }

  function onChangeCurrencyClick(side: "source" | "destination") {
    setCurrenciesModalData(side);
  }

  function onConvertedMoneyModalClose() {
    setLastConvertedData(null);
  }

  const isBalanceExceeded = checkBalanceExceeded(amounts.source);
  const isFromZero = !Number.parseFloat(amounts.source);

  if (
    activeAccounts.current.source === null ||
    activeAccounts.current.destination === null
  )
    return <p>No user accounts!</p>;

  return (
    <Layout header={<>Sell {fromCurrency.shortcut}</>}>
      <div className="text-blue-500 text-base font-bold px-4 mb-4">
        <ExchangeIcon className="inline-block mr-1" />
        {fromCurrency.symbol}1 = {toCurrency.symbol}
        <span data-testid="rate">{exchangeRate.toFixed(4)}</span>
      </div>

      <form
        onSubmit={onSubmit}
        className="flex flex-row flex-wrap justify-center"
      >
        <Field isValid={!isBalanceExceeded}>
          <ChangeCurrencyBtn clickHandler={() => onChangeCurrencyClick("source")}>
            {fromCurrency.shortcut}
          </ChangeCurrencyBtn>
          <ExchangeInput
            name="sourceAmount"
            label="Amount to be sold"
            isValid={!isBalanceExceeded}
            prefix={`-${fromCurrency.symbol}`}
            value={amounts.source}
            onChangeHandler={onChangeFromAmount}
          />
          <span className="text-base text-gray-400 basis-1/2 shrink">
            Balance: {activeAccounts.current.source.balance.toFixed(2)}
          </span>
          <p className="text-red-400 font-bold text-base text-right">
            {isBalanceExceeded && "exceeds balance"}
          </p>
        </Field>
        <Field isValid>
          <ChangeCurrencyBtn clickHandler={() => onChangeCurrencyClick("destination")}>
            {toCurrency.shortcut}
          </ChangeCurrencyBtn>
          <ExchangeInput
            name="destinationAmount"
            label="Amount to be bought"
            isValid={true}
            prefix={`+${toCurrency.symbol}`}
            value={amounts.destination}
            onChangeHandler={onChangeToAmount}
          />
          <span className="text-base text-gray-400 basis-full shrink">
            Balance: {activeAccounts.current.destination.balance.toFixed(2)}
          </span>
        </Field>

        <SubmitButton isDisabled={isBalanceExceeded || isFromZero}>
          Sell {fromCurrency.shortcut} for {toCurrency.shortcut}
        </SubmitButton>
      </form>

      <CurrenciesModal
        open={!!currenciesModalData}
        data={dataForCurrenciesModal}
        onItemSelected={onCurrencySwitch}
      />
      <ConvertedMoneyModal
        open={!!lastConvertedData}
        data={lastConvertedData}
        onClose={onConvertedMoneyModalClose}
      />
    </Layout>
  );
}
