import { DEFAULT_APP_CONFIG } from "@criation/config";
import { ApiErrorCode, type ApiError, type ApiResponse } from "@criation/types";
import { isRecord, toErrorMessage } from "@criation/utils";

import { ApiClientError, statusToErrorCode } from "./errors";

export type QueryValue = string | number | boolean | null | undefined;
export type QueryParams = Record<string, QueryValue | QueryValue[]>;

export interface ApiClientOptions {
  /** Base URL of the backend, without a trailing slash. */
  baseUrl?: string;
  /** Request timeout in milliseconds. */
  timeoutMs?: number;
  /**
   * Returns the bearer token to attach, or null/undefined for anonymous
   * requests. May be async so callers can read from secure storage.
   */
  getToken?: () => string | null | undefined | Promise<string | null | undefined>;
  /** Extra headers merged into every request. */
  defaultHeaders?: Record<string, string>;
  /**
   * Injectable fetch, so tests and server runtimes can supply their own.
   * Defaults to the platform `fetch`, which exists in browsers, React Native
   * and Node 18+.
   */
  fetchImpl?: typeof fetch;
  /** Called whenever the backend answers 401, e.g. to clear the session. */
  onUnauthorized?: () => void;
}

export interface RequestOptions {
  query?: QueryParams;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  /** Skip attaching the bearer token for this request. */
  anonymous?: boolean;
}

/** Serialises a query object, dropping null/undefined and expanding arrays. */
export function buildQueryString(query: QueryParams | undefined): string {
  if (!query) return "";
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === null || value === undefined) continue;
    if (Array.isArray(value)) {
      for (const item of value) {
        if (item !== null && item !== undefined) params.append(key, String(item));
      }
    } else {
      params.append(key, String(value));
    }
  }
  const serialized = params.toString();
  return serialized ? `?${serialized}` : "";
}

function toApiError(payload: unknown, status: number): ApiError {
  if (isRecord(payload) && isRecord(payload.error)) {
    const error = payload.error;
    return {
      code:
        typeof error.code === "string"
          ? (error.code as ApiError["code"])
          : statusToErrorCode(status),
      message:
        typeof error.message === "string" ? error.message : `Request failed with status ${status}`,
      ...(isRecord(error.fields) ? { fields: error.fields as Record<string, string[]> } : {}),
    };
  }
  return {
    code: statusToErrorCode(status),
    message: `Request failed with status ${status}`,
  };
}

export class ApiClient {
  private readonly baseUrl: string;
  private readonly timeoutMs: number;
  private readonly defaultHeaders: Record<string, string>;
  private readonly fetchImpl: typeof fetch;
  private readonly getToken: ApiClientOptions["getToken"];
  private readonly onUnauthorized: ApiClientOptions["onUnauthorized"];

  constructor(options: ApiClientOptions = {}) {
    const fetchImpl = options.fetchImpl ?? globalThis.fetch;
    if (typeof fetchImpl !== "function") {
      throw new Error("No global fetch available; pass `fetchImpl` to createApiClient");
    }

    this.baseUrl = (options.baseUrl ?? DEFAULT_APP_CONFIG.apiUrl).replace(/\/+$/, "");
    this.timeoutMs = options.timeoutMs ?? DEFAULT_APP_CONFIG.apiTimeoutMs;
    this.defaultHeaders = { Accept: "application/json", ...options.defaultHeaders };
    this.fetchImpl = fetchImpl;
    this.getToken = options.getToken;
    this.onUnauthorized = options.onUnauthorized;
  }

  get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>("GET", path, undefined, options);
  }

  post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>("POST", path, body, options);
  }

  patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>("PATCH", path, body, options);
  }

  put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>("PUT", path, body, options);
  }

  delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>("DELETE", path, undefined, options);
  }

  /**
   * Performs a request and unwraps the `ApiResponse` envelope, returning the
   * `data` payload or throwing `ApiClientError`.
   */
  async request<T>(
    method: string,
    path: string,
    body?: unknown,
    options: RequestOptions = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${path}${buildQueryString(options.query)}`;
    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      ...options.headers,
    };

    if (body !== undefined) headers["Content-Type"] = "application/json";

    if (!options.anonymous && this.getToken) {
      const token = await this.getToken();
      if (token) headers.Authorization = `Bearer ${token}`;
    }

    // Combine the caller's signal with our own timeout so either can abort.
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    const abortFromCaller = () => controller.abort();
    options.signal?.addEventListener("abort", abortFromCaller);

    let response: Response;
    try {
      response = await this.fetchImpl(url, {
        method,
        headers,
        signal: controller.signal,
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      });
    } catch (error) {
      const timedOut = controller.signal.aborted && !options.signal?.aborted;
      throw new ApiClientError(
        {
          code: timedOut ? ApiErrorCode.Timeout : ApiErrorCode.NetworkError,
          message: timedOut
            ? `Request to ${path} timed out after ${this.timeoutMs}ms`
            : toErrorMessage(error, "Network request failed"),
        },
        0,
      );
    } finally {
      clearTimeout(timer);
      options.signal?.removeEventListener("abort", abortFromCaller);
    }

    if (response.status === 204) return undefined as T;

    const text = await response.text();
    let payload: unknown = undefined;
    if (text) {
      try {
        payload = JSON.parse(text);
      } catch {
        payload = undefined;
      }
    }

    if (!response.ok) {
      if (response.status === 401) this.onUnauthorized?.();
      throw new ApiClientError(toApiError(payload, response.status), response.status);
    }

    const envelope = payload as ApiResponse<T> | undefined;
    if (isRecord(envelope) && envelope.success === false) {
      throw new ApiClientError(toApiError(envelope, response.status), response.status);
    }
    if (isRecord(envelope) && "data" in envelope) {
      return envelope.data as T;
    }
    return payload as T;
  }
}

export function createApiClient(options?: ApiClientOptions): ApiClient {
  return new ApiClient(options);
}
