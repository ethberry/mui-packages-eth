import { ChangeEvent, FC } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useIntl } from "react-intl";

import { EntityInput } from "@ethberry/mui-inputs-entity";
import { TokenType } from "@ethberry/types-blockchain";

export interface ITokenInputProps {
  prefix: string;
  name?: string;
  autoSelect?: boolean;
  readOnly?: boolean;
  disableClear?: boolean;
  data?: {
    tokenStatus?: Array<string>;
    [k: string]: any;
  };
}

export const TokenInput: FC<ITokenInputProps> = props => {
  const { prefix, name = "tokenId", data, readOnly, autoSelect, disableClear = true } = props;
  const form = useFormContext<any>();

  const { formatMessage } = useIntl();
  const tokenType = useWatch({ name: `${prefix}.tokenType` });
  const contractId = useWatch({ name: `${prefix}.contractId` });

  if (!contractId) {
    return null;
  }

  const handleChange = (_event: ChangeEvent<unknown>, option: any): void => {
    form.setValue(`${prefix}.tokenId`, option?.id ?? 0, { shouldDirty: true }); // actually id
    form.setValue(`${prefix}.token.tokenId`, option?.tokenId ?? 0);
    form.setValue(`${prefix}.templateId`, option?.template.id ?? 0);
  };

  switch (tokenType) {
    case TokenType.ERC721:
    case TokenType.ERC998:
    case TokenType.ERC1155:
      return (
        <EntityInput
          name={`${prefix}.${name}`}
          optionKey={"tokenId"}
          controller="tokens"
          data={{
            contractIds: [contractId],
            ...data,
          }}
          label={formatMessage({ id: "form.labels.tokenIds" })}
          placeholder={formatMessage({ id: "form.placeholders.tokenIds" })}
          getTitle={(token: any) => `${token.template.title as string} #${token.tokenId as string}`}
          readOnly={readOnly}
          autoselect={autoSelect}
          onChange={handleChange}
          disableClear={readOnly || disableClear}
        />
      );
    case TokenType.NATIVE:
    case TokenType.ERC20:
    default:
      return null;
  }
};
