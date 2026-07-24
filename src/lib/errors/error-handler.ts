import axios, { type AxiosResponse } from "axios";
import { ApiError } from "./api-error";
import type { ApiErrorCode, ApiErrorResponse } from "./types";

/**
 * Convierte una respuesta de error HTTP de axios en un ApiError.
 */
export function handleApiError(response: AxiosResponse): ApiError {
  const data = response.data as Partial<ApiErrorResponse> | undefined;

  const code = getErrorCode(response.status);

  return new ApiError({
    // Fallback defensivo en es-ES por si `data` no es el envelope esperado
    // (p. ej. un HTML de error de un proxy en vez del JSON del backend).
    message:
      typeof data?.message === "string" && data.message.trim().length > 0
        ? data.message
        : "Ha ocurrido un error inesperado. Inténtalo de nuevo.",
    code,
    statusCode: response.status,
    errors: data?.errors,
  });
}

/**
 * Convierte un error de red/timeout (sin respuesta HTTP) en un ApiError.
 */
export function handleNetworkError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    // Timeout: axios aborta la petición al superar el `timeout` configurado
    if (error.code === "ECONNABORTED") {
      return new ApiError({
        message: "La solicitud ha tardado demasiado. Inténtalo de nuevo.",
        code: "TIMEOUT_ERROR",
      });
    }
    // Fallo de red: sin conexión, DNS, CORS, servidor inalcanzable...
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

/**
 * Map HTTP status to error code.
 * El backend usa 400 (no 422) para errores de validación (envelope con `errors`).
 */
function getErrorCode(status: number): ApiErrorCode {
  if (status === 401) return "UNAUTHORIZED";
  if (status === 403) return "FORBIDDEN";
  if (status === 404) return "NOT_FOUND";
  if (status === 400) return "VALIDATION_ERROR";
  if (status >= 500) return "SERVER_ERROR";
  return "UNKNOWN_ERROR";
}
