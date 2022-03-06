import React from "react";

import classnames from "classnames";

import { DownIcon } from "../../components/icons";

interface SubmitButtonProps {
  isDisabled: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  children,
  isDisabled,
}) => (
  <button
    type="submit"
    className={classnames(
      "rounded-full",
      "p-4",
      "w-6/12",
      "fixed",
      "bottom-0",
      "inset-x-0",
      "m-auto",
      "my-8",
      "text-white",
      {
        "bg-blue-500": !isDisabled,
        "bg-gray-800": isDisabled,
      }
    )}
    disabled={isDisabled}
  >
    {children}
  </button>
);

export const Field: React.FC<{ isValid: boolean }> = ({ isValid, children }) => (
  <div
    className={classnames(
      "rounded-xl",
      "mx-4",
      "my-2",
      "p-4",
      "flex",
      "flex-row",
      "flex-wrap",
      "justify-between",
      "gap-1",
      "w-full",
      "md:w-1/3",
      {
        "bg-slate-800": isValid,
      },
      {
        "bg-rose-900": !isValid,
      }
    )}
  >
    {children}
  </div>
);


export const ChangeCurrencyBtn: React.FC<{ clickHandler: () => void }> = ({
  clickHandler,
  children,
}) => (
  <button onClick={clickHandler} className="text-white text-lg" type="button">
    {children}
    <DownIcon className="inline-block mx-2" />
  </button>
);

interface ExchangeInputProps {
  isValid: boolean;
  name: string;
  label: string;
  prefix: string;
  value: string;
  onChangeHandler: React.FormEventHandler<HTMLInputElement>;
}

export const ExchangeInput = ({
  isValid,
  name,
  prefix,
  value,
  label,
  onChangeHandler,
}: ExchangeInputProps) => {
  return (
    <label className="text-white text-lg text-right basis-1/2"> 
      <span>{prefix}</span>
      <span className="relative">
        <span aria-hidden="true">{value || "0"}</span>
        <input
          name={name}
          aria-label={label}
          inputMode="decimal"
          placeholder="0"
          value={value}
          onChange={onChangeHandler}
          className={classnames(
            "absolute",
            "w-full",
            "left-0",
            {
              "bg-slate-800": isValid,
            },
            {
              "bg-rose-900": !isValid,
            }
          )}
        ></input>
      </span>
    </label>
  );
};
