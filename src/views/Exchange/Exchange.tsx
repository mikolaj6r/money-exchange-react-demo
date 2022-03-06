import React from "react";

import useExchange from "../../hooks/useExchange";
import ExchangeWithData from './ExchangeWithData'

export default function ExchangeView() {
  const exchangeData = useExchange();

  if (exchangeData.status === "loading")
    return <p>Loading...</p>;

  if (exchangeData.status === "error") return <p>An error has occurred!</p>;

  return (
    <ExchangeWithData exchangeData={exchangeData}/>
  )
}
