import type { ApiErrorCode, ApiErrorResponse } from "./types";

/**
 * Custom API Error class
 */
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

    // Mantener el stack trace correcto
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  /**
   * Check if error is of a specific type
   */
  is(code: ApiErrorCode): boolean {
    return this.code === code;
  }

  /**
   * Check if error is retryable
   */
  isRetryable(): boolean {
    return (
      this.code === "NETWORK_ERROR" ||
      this.code === "TIMEOUT_ERROR" ||
      (this.statusCode !== undefined && this.statusCode >= 500)
    );
  }
}
