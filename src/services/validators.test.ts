import { isInputValid } from './validators'

test("input is valid", () => {
  expect(isInputValid("")).toBe(true);
  expect(isInputValid("1")).toBe(true);
  expect(isInputValid("01")).toBe(true);
  expect(isInputValid("10")).toBe(true);
  expect(isInputValid("10.1")).toBe(true);
  expect(isInputValid("10.20")).toBe(true);
  expect(isInputValid("30.")).toBe(true);

})

test("input is invalid", () => {
  expect(isInputValid("30.555")).toBe(false);
  expect(isInputValid("50.5555")).toBe(false);
  expect(isInputValid("50.5.10")).toBe(false);
  expect(isInputValid("50.40.1")).toBe(false);
  expect(isInputValid(".5")).toBe(false);
  expect(isInputValid(".")).toBe(false);
  expect(isInputValid(".20")).toBe(false);
})