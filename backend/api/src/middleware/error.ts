import { ApiErrorCode } from "@criation/types";
import { toErrorMessage } from "@criation/utils";
import type { NextFunction, Request, Response } from "express";

import { sendError } from "../lib/http";

/** Terminal 404 handler for unmatched routes. */
export function notFoundHandler(req: Request, res: Response): void {
  sendError(res, 404, ApiErrorCode.NotFound, `No route matches ${req.method} ${req.path}`);
}

/**
 * Express error handler. Keeps the shared `ApiFailure` envelope so every
 * client can rely on one error shape.
 */
export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (res.headersSent) return;

  console.error("[criation-api] unhandled error:", error);
  sendError(res, 500, ApiErrorCode.Internal, toErrorMessage(error, "Internal server error"));
}
