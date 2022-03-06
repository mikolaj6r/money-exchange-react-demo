import React from "react";

import { render, waitFor,waitForElementToBeRemoved, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "./App";

test("App - happy path", async () => {
  render(<App />);

  await waitForElementToBeRemoved(screen.getByText("Loading..."))

  const sellBtn = screen.getByRole("button", {
    name: /Sell\s\w+\sfor\s\w+/,
    exact: false,
  });
  expect(sellBtn).toBeInTheDocument();
  expect(sellBtn).toBeDisabled();

  const sourceInput = screen.getByLabelText("Amount to be sold");
  const destinationInput = screen.getByLabelText("Amount to be bought");

  const rate = screen.getByTestId("rate").textContent;
  expect(rate).toBeTruthy();

  const converted = 100 * Number.parseFloat(rate as string);

  userEvent.type(sourceInput, "100");
  expect(destinationInput).toHaveValue(converted.toFixed(2));

  expect(sellBtn).toBeEnabled();
  userEvent.click(sellBtn);

  await screen.findByText(`You sold`, { exact: false });
});
