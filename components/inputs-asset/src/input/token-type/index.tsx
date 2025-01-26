import { FC } from "react";

import { SelectInput } from "@ethberry/mui-inputs-core";
import { TokenType } from "@ethberry/types-blockchain";
import { SelectProps, SelectVariants } from "@mui/material";

export type ITokenTypeInputProps = {
  prefix: string;
  name?: string;
  readOnly?: boolean;
  disabledOptions?: Array<TokenType>;
  variant?: SelectVariants;
} & Omit<SelectProps, "variant">;

export const TokenTypeInput: FC<ITokenTypeInputProps> = props => {
  const { prefix, name = "tokenType", variant = "standard", disabledOptions = [], readOnly, ...rest } = props;

  return (
    <SelectInput
      name={`${prefix}.${name}`}
      options={TokenType}
      disabledOptions={disabledOptions}
      variant={variant}
      readOnly={readOnly}
      {...rest}
    />
  );
};
