/** Narrows out `null` and `undefined`; useful with `Array.prototype.filter`. */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Extracts a human readable message from an unknown thrown value. */
export function toErrorMessage(error: unknown, fallback = "Something went wrong"): string {
  if (error instanceof Error && error.message) return error.message;
  if (isNonEmptyString(error)) return error;
  if (isRecord(error) && isNonEmptyString(error.message)) return error.message;
  return fallback;
}

/** Clamps `value` into the inclusive `[min, max]` range. */
export function clamp(value: number, min: number, max: number): number {
  if (min > max) throw new RangeError("min must not be greater than max");
  return Math.min(Math.max(value, min), max);
}
