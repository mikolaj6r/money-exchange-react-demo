import axios from "axios";
import type { User, Currency, Rates, ConvertProps } from "../types";

export function getUser(): Promise<User> {
  return axios.get("/api/me").then((response) => response.data);
}

export function getCurrencies(): Promise<Currency[]> {
  return axios.get("/api/currencies").then((response) => response.data);
}

export function getRates(): Promise<Rates> {
  return axios.get("/api/latest").then((response) => response.data.rates);
}

export function createAccount(currency: string): Promise<void> {
  return axios.post(`/api/me/accounts/${currency}`);
}

export function sendExchangeRequest(params: ConvertProps): Promise<void> {
  return axios.post("/api/me/convert", params);
}
