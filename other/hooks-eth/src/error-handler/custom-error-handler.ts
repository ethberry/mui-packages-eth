export const customErrorToReason = (error: string, customErrors: Record<string, string> = {}): string => {
  const code = error.slice(0, 10);
  const errors = { ...customErrors };

  for (const key in errors) {
    if (key === code) {
      return errors[key];
    }
  }
  return "Unknown custom error";
};
