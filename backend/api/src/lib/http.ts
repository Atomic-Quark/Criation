import { ApiErrorCode, type ApiFailure, type ApiSuccess, type Paginated } from "@criation/types";
import type { Response } from "express";

/** Wraps a payload in the shared `ApiSuccess` envelope. */
export function sendSuccess<T>(res: Response, data: T, status = 200): void {
  const body: ApiSuccess<T> = { success: true, data };
  res.status(status).json(body);
}

/** Wraps an error in the shared `ApiFailure` envelope. */
export function sendError(
  res: Response,
  status: number,
  code: ApiErrorCode,
  message: string,
  fields?: Record<string, string[]>,
): void {
  const body: ApiFailure = {
    success: false,
    error: { code, message, ...(fields ? { fields } : {}) },
  };
  res.status(status).json(body);
}

export function sendNotFound(res: Response, message = "Resource not found"): void {
  sendError(res, 404, ApiErrorCode.NotFound, message);
}

/** Slices an in-memory collection into the shared `Paginated` shape. */
export function paginate<T>(items: readonly T[], page: number, pageSize: number): Paginated<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    pagination: { page, pageSize, total, totalPages },
  };
}
