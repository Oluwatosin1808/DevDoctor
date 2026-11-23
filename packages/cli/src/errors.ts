export type CdocErrorCode =
  | "INVALID_OPTION"
  | "MISSING_TARGET"
  | "INVALID_TARGET"
  | "REGISTRATION_ERROR"
  | "SCAN_FAILED";

/** Errors with a stable code and a message safe to print without a stack trace. */
export class CdocError extends Error {
  readonly code: CdocErrorCode;

  constructor(code: CdocErrorCode, message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "CdocError";
    this.code = code;
  }
}

export function toErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

export function toErrorStack(error: unknown): string | undefined {
  if (!(error instanceof Error)) return undefined;
  return error.stack;
}
