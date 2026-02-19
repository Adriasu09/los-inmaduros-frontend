import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import { ApiError, handleApiError, handleNetworkError } from "@/lib/errors";

/**
 * Configuration for HTTP Client
 */
interface HttpClientConfig {
  baseURL: string;
  timeout?: number;
  retries?: number;
  onUnauthorized?: () => void;
}

/**
 * HTTP Client with retries, timeout, and error handling
 */
class HttpClient {
  private client: AxiosInstance;
  private config: HttpClientConfig;

  constructor(config: HttpClientConfig) {
    this.config = {
      timeout: 30000,
      retries: 1,
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
    // Request interceptor - añadir token de Clerk
    this.client.interceptors.request.use(
      async (config) => {
        // TODO: Añadir token de Clerk cuando implementemos auth
        // const token = await getClerkToken();
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
      },
      (error) => {
        return Promise.reject(handleNetworkError(error));
      },
    );

    // Response interceptor - error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        // If it is an Axios error with a response
        if (error.response) {
          const apiError = await handleApiError(error.response);

          // Handling 401/403 (logout)
          if (apiError.is("UNAUTHORIZED") || apiError.is("FORBIDDEN")) {
            this.handleUnauthorized();
          }

          return Promise.reject(apiError);
        }

        // Network error or timeout
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
      return;
    }

    // Default behavior: redirect to sign-in
    if (typeof window !== "undefined") {
      window.location.href = "/sign-in";
    }
  }

  /**
   * Execute request with retries
   */
  private async executeWithRetries<T>(
    request: () => Promise<T>,
    retries: number = this.config.retries!,
  ): Promise<T> {
    let lastError: ApiError | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await request();
      } catch (error) {
        if (error instanceof ApiError) {
          lastError = error;

          if (!error.isRetryable()) {
            throw error;
          }

          if (attempt === retries) {
            throw error;
          }

          const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
          await new Promise((resolve) => setTimeout(resolve, delay));

          console.warn(
            `Retrying request (attempt ${attempt + 2}/${retries + 1})...`,
          );
        } else {
          throw handleNetworkError(error);
        }
      }
    }

    throw (
      lastError ||
      new ApiError({
        message: "Request failed after all retries",
        code: "UNKNOWN_ERROR",
      })
    );
  }

  /**
   * GET request
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.executeWithRetries(async () => {
      const response = await this.client.get<T>(url, config);
      return response.data;
    });
  }

  /**
   * POST request
   */
  async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.executeWithRetries(async () => {
      const response = await this.client.post<T>(url, data, config);
      return response.data;
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.executeWithRetries(async () => {
      const response = await this.client.patch<T>(url, data, config);
      return response.data;
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.executeWithRetries(async () => {
      const response = await this.client.put<T>(url, data, config);
      return response.data;
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.executeWithRetries(async () => {
      const response = await this.client.delete<T>(url, config);
      return response.data;
    });
  }
}

// Export singleton instance
const apiClient = new HttpClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
});

export default apiClient;
