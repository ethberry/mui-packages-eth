import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { useWatch } from "react-hook-form";

import { Alert } from "@mui/material";
import { EthInput } from "@ethberry/mui-inputs-mask-eth";
import { TokenType } from "@ethberry/types-blockchain";

export interface IAmountInputProps {
  prefix: string;
  name?: string;
  readOnly?: boolean;
  forceAmount?: boolean;
  allowance?: boolean;
}

export const AmountInput: FC<IAmountInputProps> = props => {
  const { prefix, name = "amount", readOnly, forceAmount = false, allowance = false } = props;

  const tokenType = useWatch({ name: `${prefix}.tokenType` });
  const decimals = useWatch({ name: `${prefix}.template.contract.decimals` });

  switch (tokenType) {
    case TokenType.NATIVE:
      return <EthInput name={`${prefix}.${name}`} units={decimals} readOnly={readOnly} />;
    case TokenType.ERC20:
      return <EthInput name={`${prefix}.${name}`} units={decimals} readOnly={readOnly} />;
    case TokenType.ERC1155:
      return allowance ? (
        <Alert severity="warning" sx={{ mt: 2 }}>
          <FormattedMessage id="alert.allowanceWarning" />
        </Alert>
      ) : (
        <EthInput name={`${prefix}.${name}`} units={decimals} readOnly={readOnly} symbol="" />
      );
    case TokenType.ERC721:
    case TokenType.ERC998:
      if (forceAmount) {
        return <EthInput name={`${prefix}.${name}`} units={decimals} readOnly={readOnly} symbol="" />;
      }
      return null;
    default:
      return null;
  }
};
