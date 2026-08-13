/** Envelope returned by every successful Criation API endpoint. */
export interface ApiSuccess<T> {
  success: true;
  data: T;
}

/** Envelope returned by every failing Criation API endpoint. */
export interface ApiFailure {
  success: false;
  error: ApiError;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export const ApiErrorCode = {
  BadRequest: "bad_request",
  Unauthorized: "unauthorized",
  Forbidden: "forbidden",
  NotFound: "not_found",
  Conflict: "conflict",
  ValidationFailed: "validation_failed",
  RateLimited: "rate_limited",
  Internal: "internal_error",
  NetworkError: "network_error",
  Timeout: "timeout",
} as const;

export type ApiErrorCode = (typeof ApiErrorCode)[keyof typeof ApiErrorCode];

export interface ApiError {
  code: ApiErrorCode;
  message: string;
  /** Field-level messages keyed by dotted path, when validation failed. */
  fields?: Record<string, string[]>;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface Paginated<T> {
  items: T[];
  pagination: PaginationMeta;
}

export interface PaginationQuery {
  page?: number;
  pageSize?: number;
}

export type SortDirection = "asc" | "desc";

export interface SortQuery<TField extends string = string> {
  sortBy?: TField;
  sortDir?: SortDirection;
}
