import { Schema } from "yup";
import { BigNumber, BigNumberish } from "ethers";

const isAbsent = (value: any): boolean => value === null || value === void 0 || value === "";

export class BigNumberSchema extends Schema {
  static create() {
    return new BigNumberSchema();
  }

  constructor() {
    super({ type: "bigNumber" } as any);

    this.withMutation(() => {
      this.transform(function (value: BigNumberish, originalValue) {
        if (value === "") {
          return BigNumber.from("0");
        }
        if (this.isType(value)) {
          return BigNumber.from(originalValue);
        }
        this.typeError("form.validations.badInput");
        return value;
      });
    });
  }

  min(min: BigNumber | string | number, message = "form.validations.rangeUnderflow") {
    return this.test({
      message,
      name: "min",
      exclusive: true,
      params: { min },
      test(value: BigNumber) {
        return isAbsent(value) || value.gte(this.resolve(min));
      },
    });
  }

  max(max: BigNumber | string | number, message = "form.validations.rangeOverflow") {
    return this.test({
      message,
      name: "max",
      exclusive: true,
      params: { max },
      test(value: BigNumber) {
        return isAbsent(value) || value.lte(this.resolve(max));
      },
    });
  }

  lessThan(less: BigNumber | string | number, message = "form.validations.rangeOverflow") {
    return this.test({
      message,
      name: "max",
      exclusive: true,
      params: { less },
      test(value: BigNumber) {
        return isAbsent(value) || value.lt(this.resolve(less));
      },
    });
  }

  moreThan(more: BigNumber | string | number, message = "form.validations.rangeUnderflow") {
    return this.test({
      message,
      name: "min",
      exclusive: true,
      params: { more },
      test(value: BigNumber) {
        return isAbsent(value) || value.gt(this.resolve(more));
      },
    });
  }

  required(message = "form.validations.valueMissing") {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return super.required(message).withMutation((schema: Schema) =>
      schema.test({
        message,
        name: "required",
        skipAbsent: true,
        test: (_value, options) => {
          return options.originalValue !== "";
        },
      }),
    );
  }

  _typeCheck = (value: any): value is any => {
    const type = Object.prototype.toString.call(value).slice(8, -1);
    switch (type) {
      case "Number":
      case "String":
        try {
          BigNumber.from(value);
          return true;
        } catch (e) {
          void e;
          return false;
        }
      case "Object":
        return BigNumber.isBigNumber(value);
      default:
        return false;
    }
  };
}

export const schema = new BigNumberSchema();
