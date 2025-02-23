import { addMethod, string } from "yup";
import { utils } from "ethers";

addMethod(string, "isEthereumAddress", function (errorMessage) {
  return this.test("test-eth-addr", errorMessage, function (value) {
    if (!value) {
      return false;
    }

    try {
      utils.getAddress(value);
      return true;
    } catch (e) {
      void e;
      return false;
    }
  });
});

export const addressValidationSchema = string()
  .required("form.validations.valueMissing")
  .isEthereumAddress("form.validations.patternMismatch");
