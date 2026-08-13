import { ApiErrorCode } from "@criation/types";
import { validate, type z } from "@criation/validation";
import type { NextFunction, Request, RequestHandler, Response } from "express";

import { sendError } from "../lib/http";

type Source = "body" | "query" | "params";

/**
 * Validates one part of the request with a shared Zod schema, replying with
 * the standard `validation_failed` envelope when it does not match.
 *
 * The parsed result is stashed on `res.locals.validated` because Express 5
 * exposes `req.query` as a getter that cannot be reassigned.
 */
export function validateRequest(schema: z.ZodType, source: Source = "body"): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = validate(schema, req[source]);
    if (!result.success) {
      sendError(res, 422, ApiErrorCode.ValidationFailed, result.message, result.errors);
      return;
    }
    res.locals.validated = result.data;
    next();
  };
}

/** Reads the value stored by `validateRequest`. */
export function validated<T>(res: Response): T {
  return res.locals.validated as T;
}
