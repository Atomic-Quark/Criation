import { ApiErrorCode, type ApiError } from "@criation/types";

/** Error thrown by the shared client for every non-2xx or transport failure. */
export class ApiClientError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number;
  readonly fields?: Record<string, string[]>;

  constructor(error: ApiError, status: number) {
    super(error.message);
    this.name = "ApiClientError";
    this.code = error.code;
    this.status = status;
    if (error.fields) this.fields = error.fields;
  }

  /** True when retrying the same request could plausibly succeed. */
  get isRetryable(): boolean {
    return (
      this.code === ApiErrorCode.NetworkError ||
      this.code === ApiErrorCode.Timeout ||
      this.status >= 500 ||
      this.status === 429
    );
  }
}

const STATUS_TO_CODE: Record<number, ApiErrorCode> = {
  400: ApiErrorCode.BadRequest,
  401: ApiErrorCode.Unauthorized,
  403: ApiErrorCode.Forbidden,
  404: ApiErrorCode.NotFound,
  409: ApiErrorCode.Conflict,
  422: ApiErrorCode.ValidationFailed,
  429: ApiErrorCode.RateLimited,
};

export function statusToErrorCode(status: number): ApiErrorCode {
  return STATUS_TO_CODE[status] ?? ApiErrorCode.Internal;
}
