import type { ApiErrorCode, ApiErrorResponse } from "./types";

export class ApiError extends Error {
  public readonly code: ApiErrorCode;
  public readonly statusCode?: number;
  public readonly errors?: Record<string, string[]>;

  constructor(params: {
    message: string;
    code: ApiErrorCode;
    statusCode?: number;
    errors?: Record<string, string[]>;
  }) {
    super(params.message);
    this.name = "ApiError";
    this.code = params.code;
    this.statusCode = params.statusCode;
    this.errors = params.errors;

    Object.setPrototypeOf(this, ApiError.prototype);
  }

  is(code: ApiErrorCode): boolean {
    return this.code === code;
  }

  isRetryable(): boolean {
    return (
      this.code === "NETWORK_ERROR" ||
      this.code === "TIMEOUT_ERROR" ||
      (this.statusCode !== undefined && this.statusCode >= 500)
    );
  }
}
