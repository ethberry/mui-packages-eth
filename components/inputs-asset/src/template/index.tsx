import { FC, useLayoutEffect } from "react";
import { get, useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { useIntl } from "react-intl";
import { Box, IconButton, Paper, Tooltip, Typography } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";

import { TokenType } from "@ethberry/types-blockchain";

import { emptyItem, emptyPrice } from "./empty";
import { TokenTypeInput } from "../input/token-type";
import { ContractInput } from "../input/contract";
import { TemplateInput } from "../input/template";
import { AmountInput } from "../input/amount";
import type { ITemplateAssetComponent } from "./types";
import { ContractFeatures } from "../interfaces";

type TAssetComponentParams = ITemplateAssetComponent & {
  id: string;
};

export interface ITemplateAssetProps {
  prefix: string;
  multiple?: boolean;
  autoSelect?: boolean;
  disableClear?: boolean;
  readOnly?: boolean;
  required?: boolean;
  showLabel?: boolean;
  forceAmount?: boolean;
  tokenType?: {
    disabledOptions?: Array<TokenType>;
  };
  contract?: {
    data?: {
      includeExternalContracts?: boolean;
      excludeFeatures?: Array<ContractFeatures>;
      contractModule?: Array<string>;
      contractStatus?: Array<string>;
      [k: string]: any;
    };
  };
  template?: {
    data?: {
      templateStatus?: Array<string>;
      [k: string]: any;
    };
  };
}

export const TemplateAssetInput: FC<ITemplateAssetProps> = props => {
  const {
    prefix = "price",
    multiple = false,
    tokenType,
    contract,
    template,
    readOnly,
    autoSelect,
    disableClear = true,
    showLabel = true,
    forceAmount = false,
    required = false,
  } = props;

  const { formatMessage } = useIntl();
  const form = useFormContext<any>();
  const ancestorPrefix = prefix.split(".").pop()!;
  const nestedPrefix = `${prefix}.components`;
  const formattedLabel = `${formatMessage({ id: `form.labels.${ancestorPrefix}` })}${required ? " *" : ""}`;

  const { fields, append, remove } = useFieldArray({ name: nestedPrefix, control: form.control });
  const watchFields = useWatch({ name: nestedPrefix });
  const values: TAssetComponentParams[] = fields.map(
    (field, index) =>
      ({
        ...field,
        ...watchFields[index],
      }) as TAssetComponentParams,
  );

  useLayoutEffect(() => {
    if (forceAmount) {
      values.map((val, indx) => {
        const comp = get(form.getValues(), `${nestedPrefix}[${indx}]`);
        if (forceAmount && !comp.allowEmpty) {
          Object.assign(comp, { forceAmount });
          form.setValue(`${nestedPrefix}[${indx}]`, comp);
        }
        return val;
      });
    }
  }, [forceAmount]);

  const handleOptionAdd = (): (() => void) => (): void => {
    append((ancestorPrefix === "price" ? emptyPrice : emptyItem).components[0]);
  };

  const handleOptionDelete =
    (i: number): (() => void) =>
    (): void => {
      remove(i);
    };

  return (
    <Box mt={2}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {showLabel ? <Typography sx={{ mr: 1 }}>{formattedLabel}</Typography> : null}
        {multiple && !readOnly ? (
          <Tooltip title={formatMessage({ id: "form.tips.create" })}>
            <IconButton size="small" aria-label="add" onClick={handleOptionAdd()}>
              <Add fontSize="large" color="primary" />
            </IconButton>
          </Tooltip>
        ) : null}
      </Box>

      {values?.map((o: TAssetComponentParams, i: number) => (
        <Box key={o.id} mt={1} mb={1} display="flex" justifyContent="space-between" alignItems="center">
          <Box flex={1}>
            <Paper sx={{ p: 2, display: "flex", alignItems: "stretch", flex: 1, flexDirection: "column" }}>
              <TokenTypeInput
                prefix={`${nestedPrefix}[${i}]`}
                disabledOptions={tokenType?.disabledOptions}
                readOnly={readOnly}
              />
              <ContractInput prefix={`${nestedPrefix}[${i}]`} readOnly={readOnly} data={contract?.data} />
              <TemplateInput
                prefix={`${nestedPrefix}[${i}]`}
                readOnly={readOnly}
                autoSelect={autoSelect}
                disableClear={disableClear}
                data={template?.data}
              />
              <AmountInput prefix={`${nestedPrefix}[${i}]`} readOnly={readOnly} forceAmount={forceAmount} />
            </Paper>
          </Box>

          {multiple && !readOnly && (
            <Box ml={2}>
              <Tooltip title={formatMessage({ id: "form.tips.delete" })}>
                <span>
                  <IconButton aria-label="delete" onClick={handleOptionDelete(i)} disabled={!i}>
                    <Delete />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
};
