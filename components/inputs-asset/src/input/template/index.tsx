import { ChangeEvent, FC } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useIntl } from "react-intl";

import { EntityInput, NoContentEntity } from "@ethberry/mui-inputs-entity";
import { TokenType } from "@ethberry/types-blockchain";
import { CommonStatus } from "../../interfaces";

export interface ITemplateInputProps {
  prefix: string;
  name?: string;
  readOnly?: boolean;
  autoSelect?: boolean;
  disableClear?: boolean;
  data?: {
    templateStatus?: Array<string>;
  };
}

export const TemplateInput: FC<ITemplateInputProps> = props => {
  const { prefix, name = "templateId", data, readOnly, autoSelect, disableClear = true } = props;

  const { formatMessage } = useIntl();
  const form = useFormContext<any>();
  const tokenType = useWatch({ name: `${prefix}.tokenType` });
  const contractId = useWatch({ name: `${prefix}.contractId` });

  const handleChange = (_event: ChangeEvent<unknown>, option: any): void => {
    form.setValue(`${prefix}.${name}`, option?.id ?? 0, { shouldDirty: true });
    form.setValue(`${prefix}.template.tokens`, option?.tokens ?? []);
  };

  if (!contractId) {
    return null;
  }

  switch (tokenType) {
    case TokenType.ERC721:
      return (
        <EntityInput
          name={`${prefix}.${name}`}
          controller="templates"
          label={formatMessage({ id: "form.labels.templateIds" })}
          placeholder={formatMessage({ id: "form.placeholders.templateIds" })}
          data={{
            contractIds: [contractId],
            templateStatus: [CommonStatus.ACTIVE, CommonStatus.HIDDEN],
            ...data,
          }}
          onChange={handleChange}
          readOnly={readOnly}
          autoselect={autoSelect}
          disableClear={readOnly || disableClear}
        />
      );
    case TokenType.ERC998:
      return (
        <EntityInput
          name={`${prefix}.${name}`}
          controller="templates"
          label={formatMessage({ id: "form.labels.templateIds" })}
          placeholder={formatMessage({ id: "form.placeholders.templateIds" })}
          data={{
            contractIds: [contractId],
            templateStatus: [CommonStatus.ACTIVE, CommonStatus.HIDDEN],
            ...data,
          }}
          onChange={handleChange}
          readOnly={readOnly}
          autoselect={autoSelect}
          disableClear={readOnly || disableClear}
        />
      );
    case TokenType.ERC1155:
      return (
        <EntityInput
          name={`${prefix}.${name}`}
          controller="templates"
          label={formatMessage({ id: "form.labels.templateIds" })}
          placeholder={formatMessage({ id: "form.placeholders.templateIds" })}
          data={{
            contractIds: [contractId],
            templateStatus: [CommonStatus.ACTIVE, CommonStatus.HIDDEN],
            ...data,
          }}
          onChange={handleChange}
          readOnly={readOnly}
          autoselect={autoSelect}
          disableClear={readOnly || disableClear}
        />
      );
    case TokenType.NATIVE:
    case TokenType.ERC20:
      return (
        <NoContentEntity
          name={`${prefix}.${name}`}
          controller="templates"
          data={{
            contractIds: [contractId],
            templateStatus: [CommonStatus.ACTIVE, CommonStatus.HIDDEN],
            ...data,
          }}
          autoselect={autoSelect}
          onChange={handleChange}
        />
      );
    default:
      return null;
  }
};
