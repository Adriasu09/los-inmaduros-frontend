import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import { handleApiError, handleNetworkError } from "@/lib/errors";

// Bridge to inject the Clerk token into every request without depending on React.
let getClerkToken: (() => Promise<string | null>) | null = null;

export function setClerkTokenGetter(
  fn: (() => Promise<string | null>) | null,
): void {
  getClerkToken = fn;
}

interface HttpClientConfig {
  baseURL: string;
  timeout?: number;
  onUnauthorized?: () => void;
}

// Retries live in React Query (a single layer), not here: this avoids
// stacking retries and never auto-retries mutations (edit/cancel/delete),
// which could otherwise duplicate side effects.
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

  private setupInterceptors(): void {
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

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          const apiError = handleApiError(error.response);
          // Only 401 (invalid session) triggers re-auth. 403 means
          // "authenticated but not allowed" and must not force a re-login.
          if (apiError.is("UNAUTHORIZED")) {
            this.handleUnauthorized();
          }
          return Promise.reject(apiError);
        }
        return Promise.reject(handleNetworkError(error));
      },
    );
  }

  private handleUnauthorized(): void {
    if (this.config.onUnauthorized) {
      this.config.onUnauthorized();
    }
    // No default redirect: Clerk handles re-authentication via modal/redirect.
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

const apiClient = new HttpClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
});

export default apiClient;
