import { ApiError } from "./api-error";
import type { ApiErrorCode, ApiErrorResponse } from "./types";

/**
 * Handle API error responses
 */
export async function handleApiError(response: Response): Promise<ApiError> {
  let errorData: ApiErrorResponse;

  try {
    errorData = await response.json();
  } catch {
    errorData = {
      message: response.statusText || "Unknown error",
      statusCode: response.status,
    };
  }

  const code = getErrorCode(response.status);

  return new ApiError({
    message: errorData.message || "An error occurred",
    code,
    statusCode: response.status,
    errors: errorData.errors,
  });
}

/**
 * Handle network errors
 */
export function handleNetworkError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof Error) {
    // Timeout error
    if (error.name === "AbortError" || error.message.includes("timeout")) {
      return new ApiError({
        message: "Request timeout. Please try again.",
        code: "TIMEOUT_ERROR",
      });
    }

    // Network error
    if (error.message.includes("fetch") || error.message.includes("network")) {
      return new ApiError({
        message: "Network error. Please check your connection.",
        code: "NETWORK_ERROR",
      });
    }
  }

  // Unknown error
  return new ApiError({
    message: "An unexpected error occurred",
    code: "UNKNOWN_ERROR",
  });
}

/**
 * Map HTTP status to error code
 */
function getErrorCode(status: number): ApiErrorCode {
  if (status === 401) return "UNAUTHORIZED";
  if (status === 403) return "FORBIDDEN";
  if (status === 404) return "NOT_FOUND";
  if (status === 422) return "VALIDATION_ERROR";
  if (status >= 500) return "SERVER_ERROR";
  return "UNKNOWN_ERROR";
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: ApiError): boolean {
  return error.isRetryable();
}
