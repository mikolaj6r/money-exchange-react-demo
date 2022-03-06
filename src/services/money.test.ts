import {convertMoney, amountFormatter, convertAndFormat } from './money'

test("convertMoney", () => {
  expect(convertMoney(1, 1, 1)).toBe(1);
  expect(convertMoney(1, 2, 4)).toBe(2);
  expect(convertMoney(1, 4, 2)).toBe(0.5);
  expect(convertMoney(2.5, 2.5, 2)).toBe(2);
  expect(convertMoney(3.45, 3.45, 3.3)).toBe(3.3);
  expect(convertMoney(2.5, 5.00, 4.50)).toBe(2.25);
})


test("amountFormatter", () => {
  expect(amountFormatter(0)).toBe("0");
  expect(amountFormatter(2.)).toBe("2.00");
  expect(amountFormatter(4.3)).toBe("4.30");
  expect(amountFormatter(4.60)).toBe("4.60");
  expect(amountFormatter(5.78906)).toBe("5.79");
  expect(amountFormatter(-3)).toBe("-3.00");
})

test("convertAndFormat", () => {
  expect(convertAndFormat("2", 1, 1)).toBe("2.00");
  expect(convertAndFormat("2.0", 1, 1)).toBe("2.00");
  expect(convertAndFormat("3.33", 1, 1)).toBe("3.33");
})