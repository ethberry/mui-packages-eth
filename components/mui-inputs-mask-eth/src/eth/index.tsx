import { FC } from "react";
import { useWatch } from "react-hook-form";
import { BigNumberish, constants } from "ethers";

import { MaskedInput } from "@ethberry/mui-inputs-mask";

import { formatValue, normalizeValue } from "./utils";

export interface IEthInputProps {
  name: string;
  allowNegative?: boolean;
  fractionalDelimiter?: string;
  fillByZeros?: boolean;
  required?: boolean;
  readOnly?: boolean;
  precision?: number;
  units?: BigNumberish;
  symbol?: string;
  thousandsSeparator?: string;
}

export const EthInput: FC<IEthInputProps> = props => {
  const {
    allowNegative = false,
    fractionalDelimiter = ".",
    fillByZeros = false,
    name,
    symbol = constants.EtherSymbol,
    thousandsSeparator = " ",
    units,
    ...rest
  } = props;

  const value = useWatch({ name });
  const normalizedValue = normalizeValue(units)(value);

  return (
    <MaskedInput
      allowNegative={allowNegative}
      decimalSeparator={fractionalDelimiter}
      decimalScale={Number(units ?? 0)}
      thousandSeparator={thousandsSeparator}
      allowLeadingZeros={fillByZeros}
      prefix={symbol ? `${symbol} ` : ""}
      name={name}
      formatValue={formatValue(units)}
      normalizeValue={normalizeValue(units)}
      defaultValue={normalizedValue}
      {...rest}
    />
  );
};
