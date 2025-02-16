import { BigNumberish, utils } from "ethers";

import { format, number } from "@ethberry/mui-inputs-mask";

export const formatValue =
  (units?: BigNumberish) =>
  (value: string): string => {
    return value ? format(number(utils.parseUnits(value, units).toString()), { notation: "fixed" }) : "";
  };

export const normalizeValue =
  (units?: BigNumberish) =>
  (value: string): string => {
    const safeValue = format(number(value), { notation: "fixed" });
    const normalizedValue = value ? utils.formatUnits(safeValue, units) : "0";
    const [whole, decimals] = normalizedValue.split(".");

    return decimals === "0" ? whole : normalizedValue;
  };
