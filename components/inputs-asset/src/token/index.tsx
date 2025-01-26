import { FC, useMemo } from "react";
import { get, useFormContext, useWatch } from "react-hook-form";
import { useIntl } from "react-intl";
import { Box, IconButton, Paper, Tooltip, Typography } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";

import { TokenType } from "@ethberry/types-blockchain";
import { useDeepCompareEffect } from "@ethberry/react-hooks";

import { ContractInput } from "../input/contract";
import { TokenInput } from "../input/token";
import type { ITokenAssetComponent } from "./types";
import { emptyToken } from "./empty";
import { TokenTypeInput } from "../input/token-type";
import { AmountInput } from "../input/amount";

export interface ITokenAssetProps {
  prefix: string;
  multiple?: boolean;
  readOnly?: boolean;
  disableClear?: boolean;
  allowance?: boolean;
  required?: boolean;
  tokenType?: {
    disabledOptions?: Array<TokenType>;
  };
  contract?: {
    data?: {
      contractModule?: Array<string>;
      contractStatus?: Array<string>;
      contractFeatures?: Array<string>;
      excludeFeatures?: Array<string>;
      [k: string]: any;
    };
  };
  token?: {
    data?: {
      tokenStatus?: Array<string>;
      [k: string]: any;
    };
  };
}

export const TokenAssetInput: FC<ITokenAssetProps> = props => {
  const {
    prefix = "price",
    multiple = false,
    tokenType,
    contract,
    token,
    readOnly,
    disableClear = true,
    allowance = false,
    required,
  } = props;

  const { formatMessage } = useIntl();

  const form = useFormContext<any>();
  const ancestorPrefix = prefix.split(".").pop()!;
  const nestedPrefix = `${prefix}.components`;
  const formattedLabel = `${formatMessage({ id: `form.labels.${ancestorPrefix}` })}${required ? " *" : ""}`;

  const values = get(useWatch(), nestedPrefix);

  const handleOptionAdd = (): (() => void) => (): void => {
    const newValue = get(form.getValues(), nestedPrefix);
    newValue.push(emptyToken.components[0]);
    form.setValue(nestedPrefix, newValue);
  };

  const handleOptionDelete =
    (i: number): (() => void) =>
    (): void => {
      const newValue = get(form.getValues(), nestedPrefix);
      newValue.splice(i, 1);
      form.setValue(nestedPrefix, newValue);
    };

  useDeepCompareEffect(() => {
    if (!values) {
      return;
    }
    values.forEach((value: ITokenAssetComponent, i: number) => {
      form.setValue(`${nestedPrefix}[${i}].template.contract.decimals`, value.template.contract?.decimals);
      form.setValue(`${nestedPrefix}[${i}].template.contract.address`, value.template.contract?.address);
    });
  }, [values]);

  return useMemo(
    () => (
      <Box mt={2}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography sx={{ mr: 1 }}>{formattedLabel}</Typography>
          {multiple && !readOnly ? (
            <Tooltip title={formatMessage({ id: "form.tips.create" })}>
              <IconButton size="small" aria-label="add" onClick={handleOptionAdd()}>
                <Add fontSize="large" color="primary" />
              </IconButton>
            </Tooltip>
          ) : null}
        </Box>

        {values?.map((o: ITokenAssetComponent, i: number) => (
          <Box
            key={`${o.contractId}_${o.templateId}_${i}`}
            mt={1}
            mb={1}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box flex={1}>
              <Paper sx={{ p: 2, display: "flex", alignItems: "stretch", flex: 1, flexDirection: "column" }}>
                <TokenTypeInput
                  prefix={`${nestedPrefix}[${i}]`}
                  disabledOptions={tokenType?.disabledOptions}
                  readOnly={readOnly}
                />
                <ContractInput prefix={`${nestedPrefix}[${i}]`} readOnly={readOnly} data={contract?.data} />
                <TokenInput
                  autoSelect
                  name={"token.tokenId"}
                  prefix={`${nestedPrefix}[${i}]`}
                  readOnly={readOnly}
                  data={token?.data}
                  disableClear={disableClear}
                />
                <AmountInput prefix={`${nestedPrefix}[${i}]`} readOnly={readOnly} allowance={allowance} />
              </Paper>
            </Box>

            {multiple && !readOnly && (
              <Box ml={2}>
                <Tooltip title={formatMessage({ id: "form.tips.delete" })}>
                  <IconButton aria-label="delete" onClick={handleOptionDelete(i)} disabled={!i}>
                    <Delete />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Box>
        ))}
      </Box>
    ),
    [tokenType?.disabledOptions, readOnly, values],
  );
};
