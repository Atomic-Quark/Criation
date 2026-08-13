import type { z } from "zod";

/** Field-level messages keyed by dotted path, matching `ApiError.fields`. */
export type FieldErrors = Record<string, string[]>;

export type ValidationResult<T> =
  { success: true; data: T } | { success: false; errors: FieldErrors; message: string };

/** Flattens a Zod issue list into `{ "path.to.field": ["message"] }`. */
export function toFieldErrors(error: z.ZodError): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path.length > 0 ? issue.path.join(".") : "_root";
    (errors[key] ??= []).push(issue.message);
  }
  return errors;
}

/**
 * Parses `input` and returns either the typed data or flattened field errors.
 * Never throws, so UI and API layers can share one code path.
 */
export function validate<TSchema extends z.ZodType>(
  schema: TSchema,
  input: unknown,
): ValidationResult<z.output<TSchema>> {
  const result = schema.safeParse(input);
  if (result.success) return { success: true, data: result.data };

  const errors = toFieldErrors(result.error);
  const firstMessage = result.error.issues[0]?.message ?? "Validation failed";
  return { success: false, errors, message: firstMessage };
}

/** Parses `input` or throws — use where invalid data is a programming error. */
export function validateOrThrow<TSchema extends z.ZodType>(
  schema: TSchema,
  input: unknown,
): z.output<TSchema> {
  return schema.parse(input) as z.output<TSchema>;
}
