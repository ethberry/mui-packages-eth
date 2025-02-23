// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { StringSchema } from "yup";

declare module "yup" {
  // eslint-disable-next-line
  interface StringSchema<TType, TContext, TDefault, TFlags> {
    isEthereumAddress(value: any): this;
  }
}
