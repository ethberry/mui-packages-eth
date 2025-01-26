export interface IBlockchainError {
  type: BlockchainErrorType;
  reason: string;
}

export enum BlockchainErrorType {
  EMPTY = "EMPTY",
  SYSTEM_STRING = "SYSTEM_STRING",
  SYSTEM_PANIC_CODE = "SYSTEM_PANIC_CODE",
  CUSTOM_ERROR = "CUSTOM_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export enum SystemErrorPrefix {
  EMPTY = "0x",
  ERROR_STRING_PREFIX = "0x08c379a0",
  PANIC_CODE_PREFIX = "0x4e487b71",
}

export enum PanicCodes {
  ASSERTION_ERROR = 0x1,
  ARITHMETIC_UNDER_OR_OVERFLOW = 0x11,
  DIVISION_BY_ZERO = 0x12,
  ENUM_CONVERSION_OUT_OF_BOUNDS = 0x21,
  INCORRECTLY_ENCODED_STORAGE_BYTE_ARRAY = 0x22,
  POP_ON_EMPTY_ARRAY = 0x31,
  ARRAY_ACCESS_OUT_OF_BOUNDS = 0x32,
  TOO_MUCH_MEMORY_ALLOCATED = 0x41,
  ZERO_INITIALIZED_VARIABLE = 0x51,
}

export enum PanicReasons {
  ASSERTION_ERROR = "Assertion error",
  ARITHMETIC_UNDER_OR_OVERFLOW = "Arithmetic operation underflowed or overflowed outside of an unchecked block",
  DIVISION_BY_ZERO = "Division or modulo division by zero",
  ENUM_CONVERSION_OUT_OF_BOUNDS = "Tried to convert a value into an enum, but the value was too big or negative",
  INCORRECTLY_ENCODED_STORAGE_BYTE_ARRAY = "Incorrectly encoded storage byte array",
  POP_ON_EMPTY_ARRAY = ".pop() was called on an empty array",
  ARRAY_ACCESS_OUT_OF_BOUNDS = "Array accessed at an out-of-bounds or negative index",
  TOO_MUCH_MEMORY_ALLOCATED = "Too much memory was allocated, or an array was created that is too large",
  ZERO_INITIALIZED_VARIABLE = "Called a zero-initialized variable of internal function type",
}
