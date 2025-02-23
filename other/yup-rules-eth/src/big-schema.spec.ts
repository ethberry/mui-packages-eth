import { object, ValidationError } from "yup";
import { BigNumber } from "ethers";

import { schema } from "./big-schema";

const ERROR_MESSAGE = "ERROR_MESSAGE";
const CUSTOM_ERROR_MESSAGE = "CUSTOM_ERROR_MESSAGE";

describe("BigSchema", () => {
  const minValue = BigNumber.from("100");
  const maxValue = BigNumber.from("10000");

  describe("typeError", () => {
    const schemaValidatorObject = object().shape({
      amount: schema.typeError(ERROR_MESSAGE),
    });

    it("should validate BigNumber", async () => {
      await expect(
        schemaValidatorObject.validate({
          amount: minValue,
        }),
      ).resolves.toEqual({
        amount: minValue,
      });
    });

    it("should validate Number", async () => {
      await expect(
        schemaValidatorObject.validate({
          amount: 100,
        }),
      ).resolves.toEqual({
        amount: minValue,
      });
    });

    it("should validate String", async () => {
      await expect(
        schemaValidatorObject.validate({
          amount: "100",
        }),
      ).resolves.toEqual({
        amount: minValue,
      });
    });

    it("should validate Object", async () => {
      await expect(
        schemaValidatorObject.validate({
          amount: { _hex: minValue.toHexString(), _isBigNumber: true },
        }),
      ).resolves.toEqual({
        amount: minValue,
      });
    });

    it("should fail String", async () => {
      await expect(
        schemaValidatorObject.validate({
          amount: "qwerty",
        }),
      ).rejects.toEqual(new ValidationError(ERROR_MESSAGE));
    });

    it("should fail Object", async () => {
      await expect(
        schemaValidatorObject.validate({
          amount: {},
        }),
      ).rejects.toEqual(new ValidationError(ERROR_MESSAGE));
    });

    it("should fail with custom message", async () => {
      const schemaValidatorObject = object().shape({
        amount: schema.typeError(CUSTOM_ERROR_MESSAGE),
      });
      await expect(
        schemaValidatorObject.validate({
          amount: "qwerty",
        }),
      ).rejects.toEqual(new ValidationError(CUSTOM_ERROR_MESSAGE));
    });
  });

  describe("min", () => {
    it("should validate min (BigNumber)", async () => {
      const schemaValidatorObject = object().shape({
        amount: schema.min(BigNumber.from("1000")),
      });
      await expect(
        schemaValidatorObject.validate({
          amount: "10000",
        }),
      ).resolves.toEqual({
        amount: BigNumber.from("10000"),
      });
    });

    it("should validate min (BigNumber/error)", async () => {
      const schemaValidatorObject = object().shape({
        amount: schema.min(BigNumber.from("1000")),
      });
      await expect(
        schemaValidatorObject.validate({
          amount: minValue,
        }),
      ).rejects.toEqual(new ValidationError("form.validations.rangeUnderflow"));
    });

    it("should validate min (string)", async () => {
      const schemaValidatorObject = object().shape({
        amount: schema.min("1000"),
      });
      await expect(
        schemaValidatorObject.validate({
          amount: minValue,
        }),
      ).rejects.toEqual(new ValidationError("form.validations.rangeUnderflow"));
    });

    it("should validate min (number)", async () => {
      const schemaValidatorObject = object().shape({
        amount: schema.min(1000),
      });
      await expect(
        schemaValidatorObject.validate({
          amount: minValue,
        }),
      ).rejects.toEqual(new ValidationError("form.validations.rangeUnderflow"));
    });

    it("should validate with custom message", async () => {
      const schemaValidatorObject = object().shape({
        amount: schema.min(1000, CUSTOM_ERROR_MESSAGE),
      });
      await expect(
        schemaValidatorObject.validate({
          amount: minValue,
        }),
      ).rejects.toEqual(new ValidationError(CUSTOM_ERROR_MESSAGE));
    });
  });

  describe("max", () => {
    it("should validate max (BigNumber)", async () => {
      const schemaValidatorObject = object().shape({
        amount: schema.max(BigNumber.from("10000")),
      });
      await expect(
        schemaValidatorObject.validate({
          amount: "1000",
        }),
      ).resolves.toEqual({
        amount: BigNumber.from("1000"),
      });
    });

    it("should validate max (BigNumber/error)", async () => {
      const schemaValidatorObject = object().shape({
        amount: schema.max(BigNumber.from("1000")),
      });
      await expect(
        schemaValidatorObject.validate({
          amount: maxValue,
        }),
      ).rejects.toEqual(new ValidationError("form.validations.rangeOverflow"));
    });

    it("should validate max (string)", async () => {
      const schemaValidatorObject = object().shape({
        amount: schema.max("1000"),
      });
      await expect(
        schemaValidatorObject.validate({
          amount: maxValue,
        }),
      ).rejects.toEqual(new ValidationError("form.validations.rangeOverflow"));
    });

    it("should validate max (number)", async () => {
      const schemaValidatorObject = object().shape({
        amount: schema.max(1000),
      });
      await expect(
        schemaValidatorObject.validate({
          amount: maxValue,
        }),
      ).rejects.toEqual(new ValidationError("form.validations.rangeOverflow"));
    });

    it("should validate with custom message", async () => {
      const schemaValidatorObject = object().shape({
        amount: schema.max(1000, CUSTOM_ERROR_MESSAGE),
      });
      await expect(
        schemaValidatorObject.validate({
          amount: maxValue,
        }),
      ).rejects.toEqual(new ValidationError(CUSTOM_ERROR_MESSAGE));
    });
  });

  describe("required", () => {
    const schemaValidatorObject = object().shape({
      amount: schema.typeError(ERROR_MESSAGE).required(CUSTOM_ERROR_MESSAGE),
    });

    it("null", async () => {
      await expect(
        schemaValidatorObject.validate({
          amount: null,
        }),
      ).rejects.toEqual(new ValidationError(CUSTOM_ERROR_MESSAGE));
    });

    it("undefined", async () => {
      await expect(
        schemaValidatorObject.validate({
          amount: void 0,
        }),
      ).rejects.toEqual(new ValidationError(CUSTOM_ERROR_MESSAGE));
    });

    it("empty string", async () => {
      await expect(
        schemaValidatorObject.validate({
          amount: "",
        }),
      ).rejects.toEqual(new ValidationError(CUSTOM_ERROR_MESSAGE));
    });
  });
});
