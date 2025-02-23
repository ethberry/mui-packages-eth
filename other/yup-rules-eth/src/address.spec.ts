import { object, string, ValidationError } from "yup";
import { constants } from "ethers";

import "./address";

const ERROR_MESSAGE = "ERROR_MESSAGE";

const schemaValidatorObject = object().shape({
  // @ts-ignore
  description: string().isEthereumAddress(ERROR_MESSAGE),
});

describe("Address", () => {
  it("has no address", async () => {
    await expect(
      schemaValidatorObject.validate({
        description: "",
      }),
    ).rejects.toEqual(new ValidationError(ERROR_MESSAGE));
  });

  it("has wrong address", async () => {
    await expect(
      schemaValidatorObject.validate({
        description: "qwerty",
      }),
    ).rejects.toEqual(new ValidationError(ERROR_MESSAGE));
  });

  it("has proper address", async () => {
    await expect(
      schemaValidatorObject.validate({
        description: constants.AddressZero,
      }),
    ).resolves.toEqual({
      description: constants.AddressZero,
    });
  });
});
