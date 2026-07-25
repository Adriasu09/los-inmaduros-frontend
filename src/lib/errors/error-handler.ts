import axios, { type AxiosResponse } from "axios";
import { ApiError } from "./api-error";
import type { ApiErrorCode, ApiErrorResponse } from "./types";

export function handleApiError(response: AxiosResponse): ApiError {
  const data = response.data as Partial<ApiErrorResponse> | undefined;

  const code = getErrorCode(response.status);

  return new ApiError({
    // Defensive fallback in case `data` isn't the expected envelope
    // (e.g. an HTML error page from a proxy instead of the backend's JSON).
    message:
      typeof data?.message === "string" && data.message.trim().length > 0
        ? data.message
        : "Ha ocurrido un error inesperado. Inténtalo de nuevo.",
    code,
    statusCode: response.status,
    errors: data?.errors,
  });
}

export function handleNetworkError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    if (error.code === "ECONNABORTED") {
      return new ApiError({
        message: "La solicitud ha tardado demasiado. Inténtalo de nuevo.",
        code: "TIMEOUT_ERROR",
      });
    }
    if (error.code === "ERR_NETWORK") {
      return new ApiError({
        message: "Error de red. Comprueba tu conexión e inténtalo de nuevo.",
        code: "NETWORK_ERROR",
      });
    }
  }

  return new ApiError({
    message: "Ha ocurrido un error inesperado.",
    code: "UNKNOWN_ERROR",
  });
}

function getErrorCode(status: number): ApiErrorCode {
  if (status === 401) return "UNAUTHORIZED";
  if (status === 403) return "FORBIDDEN";
  if (status === 404) return "NOT_FOUND";
  // Backend uses 400 (not 422) for validation errors.
  if (status === 400) return "VALIDATION_ERROR";
  if (status === 409) return "CONFLICT";
  if (status >= 500) return "SERVER_ERROR";
  return "UNKNOWN_ERROR";
}
