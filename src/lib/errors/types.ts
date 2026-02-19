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
  | "SERVER_ERROR"
  | "UNKNOWN_ERROR";

/**
 * API Error response structure
 */
export interface ApiErrorResponse {
  message: string;
  code?: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}
