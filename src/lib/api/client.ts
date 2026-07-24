import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import { handleApiError, handleNetworkError } from "@/lib/errors";

// Bridge para inyectar el token de Clerk en cada request sin depender de React
let getClerkToken: (() => Promise<string | null>) | null = null;

export function setClerkTokenGetter(
  fn: (() => Promise<string | null>) | null,
): void {
  getClerkToken = fn;
}

/**
 * Configuration for HTTP Client
 */
interface HttpClientConfig {
  baseURL: string;
  timeout?: number;
  onUnauthorized?: () => void;
}

/**
 * HTTP Client con timeout, token de Clerk y manejo de errores.
 */
class HttpClient {
  private client: AxiosInstance;
  private config: HttpClientConfig;

  constructor(config: HttpClientConfig) {
    this.config = {
      timeout: 30000,
      ...config,
    };

    this.client = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor - inyecta el token de Clerk si está disponible
    this.client.interceptors.request.use(
      async (config) => {
        if (getClerkToken) {
          const token = await getClerkToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(handleNetworkError(error)),
    );

    // Response interceptor - convierte los errores de axios en ApiError
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          const apiError = handleApiError(error.response);
          // Solo 401 (sesión inválida) dispara la re-autenticación.
          // 403 es "autenticado pero sin permiso" y NO debe forzar re-login.
          if (apiError.is("UNAUTHORIZED")) {
            this.handleUnauthorized();
          }
          return Promise.reject(apiError);
        }
        return Promise.reject(handleNetworkError(error));
      },
    );
  }

  /**
   * Handle unauthorized errors
   */
  private handleUnauthorized(): void {
    if (this.config.onUnauthorized) {
      this.config.onUnauthorized();
    }
    // Sin redirect por defecto: Clerk gestiona la autenticación vía modal/redirect
  }

  /**
   * GET request
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  /**
   * POST request
   */
  async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  /**
   * PATCH request
   */
  async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  /**
   * PUT request
   */
  async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  /**
   * DELETE request
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

// Export singleton instance
const apiClient = new HttpClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
});

export default apiClient;
