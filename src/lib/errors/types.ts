/**
 * Error codes for API errors
 */
export type ApiErrorCode =
  | "NETWORK_ERROR"
  | "TIMEOUT_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "CONFLICT"
  | "SERVER_ERROR"
  | "UNKNOWN_ERROR";

/**
 * Shape of the backend's error envelope. `code`/`statusCode` aren't part of
 * it (the backend only sends `message` + optional `errors`) — don't add them
 * back without checking the contract first.
 */
export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}
