import { array, mixed, number, object } from "yup";

import { bigNumberValidationSchema } from "@ethberry/yup-rules-eth";
import { TokenType } from "@ethberry/types-blockchain";

export const tokenAssetTokenTypeValidationSchema = mixed<TokenType>()
  .oneOf(Object.values(TokenType))
  .required("form.validations.valueMissing");

export const tokenAssetContractIdValidationSchema = number()
  .required("form.validations.valueMissing")
  .integer("form.validations.badInput")
  .min(1, "form.validations.rangeUnderflow");

export const tokenAssetTokenValidationSchema = object().when("tokenType", {
  is: (tokenType: TokenType) => tokenType !== TokenType.ERC20 && tokenType !== TokenType.NATIVE,
  then: schema =>
    schema.shape({
      tokenId: number()
        .min(1, "form.validations.valueMissing")
        .integer("form.validations.badInput")
        .required("form.validations.valueMissing"),
    }),
});

export const tokenAssetAmountValidationSchema = bigNumberValidationSchema.when("tokenType", {
  is: (tokenType: TokenType) => tokenType !== TokenType.ERC721 && tokenType !== TokenType.ERC998,
  then: () =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    bigNumberValidationSchema.min(1, "form.validations.rangeUnderflow").required("form.validations.valueMissing"),
});

export const tokenAssetComponentValidationSchema = object().shape({
  tokenType: tokenAssetTokenTypeValidationSchema,
  contractId: tokenAssetContractIdValidationSchema,
  token: tokenAssetTokenValidationSchema,
  amount: tokenAssetAmountValidationSchema,
});

export const tokenAssetValidationSchema = object().shape({
  components: array().of(tokenAssetComponentValidationSchema),
});
