/** Converts arbitrary text into a URL-safe slug. */
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Truncates to `maxLength` characters, appending `suffix` when it cuts. */
export function truncate(input: string, maxLength: number, suffix = "…"): string {
  if (maxLength <= 0) return "";
  if (input.length <= maxLength) return input;
  return input.slice(0, Math.max(0, maxLength - suffix.length)).trimEnd() + suffix;
}

export function capitalize(input: string): string {
  if (input.length === 0) return input;
  return input.charAt(0).toUpperCase() + input.slice(1);
}

/** Turns `"hello world"` into `"Hello World"`. */
export function titleCase(input: string): string {
  return input.split(/\s+/).filter(Boolean).map(capitalize).join(" ");
}

/** Builds up to two uppercase initials from a display name. */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  const first = parts[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1] ?? "") : "";
  return (first.charAt(0) + last.charAt(0)).toUpperCase();
}

/** Collapses runs of whitespace into single spaces and trims. */
export function normalizeWhitespace(input: string): string {
  return input.replace(/\s+/g, " ").trim();
}
