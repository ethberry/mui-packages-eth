import { array, lazy, mixed, number, object } from "yup";

import { bigNumberValidationSchema } from "@ethberry/yup-rules-eth";
import { TokenType } from "@ethberry/types-blockchain";

export const templateAssetTokenTypeValidationSchema = mixed<TokenType>()
  .oneOf(Object.values(TokenType))
  .required("form.validations.valueMissing");

export const templateAssetContractIdValidationSchema = number()
  .required("form.validations.valueMissing")
  .integer("form.validations.badInput")
  .min(1, "form.validations.rangeUnderflow");

export const templateAssetTemplateIdValidationSchema = number().when("tokenType", {
  is: (tokenType: TokenType) => tokenType !== TokenType.ERC20 && tokenType !== TokenType.NATIVE,
  then: schema =>
    schema
      .typeError("form.validations.valueMissing")
      .min(1, "form.validations.valueMissing")
      .integer("form.validations.badInput")
      .required("form.validations.valueMissing"),
});

export const templateAssetAmountValidationSchema = lazy((forceAmount: boolean) =>
  bigNumberValidationSchema.when("tokenType", {
    is: (tokenType: TokenType) => forceAmount || (tokenType !== TokenType.ERC721 && tokenType !== TokenType.ERC998),
    then: () =>
      bigNumberValidationSchema.min(1, "form.validations.rangeUnderflow").required("form.validations.valueMissing"),
  }),
);

export const templateAssetComponentValidationSchema = object().shape({
  tokenType: templateAssetTokenTypeValidationSchema,
  contractId: templateAssetContractIdValidationSchema,
  templateId: templateAssetTemplateIdValidationSchema,
  amount: templateAssetAmountValidationSchema,
});

export const templateAssetValidationSchema = object().shape({
  components: array().of(templateAssetComponentValidationSchema),
});
