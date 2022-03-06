export function isInputValid(input: string) {
  const valuesArray = input.split(".");

  if(input === '')  return true;
  // business rules
  // float, max 2 digits after dot
  if (!/^\d+(\.\d{0,2})?$/.test(input)) return false;

  // max one dot
  if (valuesArray.length > 2) return false;

  if (valuesArray.length === 2 && valuesArray[1].length === 3) {
    console.log("does it happens");
    return false;
  }

  return true;
}
