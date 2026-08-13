import type { Money } from "@criation/types";

export interface FormatPriceOptions {
  /** ISO 4217 code. Ignored when a `Money` value is passed. */
  currency?: string;
  /** BCP 47 locale tag. */
  locale?: string;
  /** Drop the fractional part when the amount is a whole unit. */
  compactZeroDecimals?: boolean;
}

const DEFAULT_LOCALE = "en-IN";
const DEFAULT_CURRENCY = "INR";

/** Currencies whose minor unit is the same as the major unit. */
const ZERO_DECIMAL_CURRENCIES = new Set(["JPY", "KRW", "VND", "CLP", "ISK"]);

function minorUnitFactor(currency: string): number {
  return ZERO_DECIMAL_CURRENCIES.has(currency.toUpperCase()) ? 1 : 100;
}

/**
 * Formats an amount held in the smallest currency unit as a display string.
 *
 * ```ts
 * formatPrice(129900);                       // "₹1,299.00"
 * formatPrice(4999, { currency: "USD", locale: "en-US" }); // "$49.99"
 * formatPrice({ amount: 129900, currency: "INR" });        // "₹1,299.00"
 * ```
 */
export function formatPrice(value: number | Money, options: FormatPriceOptions = {}): string {
  const isMoney = typeof value === "object";
  const currency = (
    isMoney ? value.currency : (options.currency ?? DEFAULT_CURRENCY)
  ).toUpperCase();
  const minorAmount = isMoney ? value.amount : value;
  const locale = options.locale ?? DEFAULT_LOCALE;
  const major = minorAmount / minorUnitFactor(currency);

  const fractionDigits = ZERO_DECIMAL_CURRENCIES.has(currency)
    ? 0
    : options.compactZeroDecimals && Number.isInteger(major)
      ? 0
      : 2;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(major);
}

/** Formats a 0-1 ratio as a percentage string, e.g. `0.125` -> `"12.5%"`. */
export function formatPercent(
  ratio: number,
  { locale = DEFAULT_LOCALE, maximumFractionDigits = 1 } = {},
): string {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits,
  }).format(ratio);
}

export function formatNumber(
  value: number,
  { locale = DEFAULT_LOCALE }: { locale?: string } = {},
): string {
  return new Intl.NumberFormat(locale).format(value);
}

/** Formats an ISO date string or `Date` for display. Returns `""` if invalid. */
export function formatDate(
  value: string | number | Date,
  { locale = DEFAULT_LOCALE, ...options }: Intl.DateTimeFormatOptions & { locale?: string } = {},
): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    ...options,
  }).format(date);
}

const RELATIVE_UNITS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
  ["year", 365 * 24 * 60 * 60 * 1000],
  ["month", 30 * 24 * 60 * 60 * 1000],
  ["day", 24 * 60 * 60 * 1000],
  ["hour", 60 * 60 * 1000],
  ["minute", 60 * 1000],
  ["second", 1000],
];

/** Formats a timestamp relative to `now`, e.g. `"3 days ago"`. */
export function formatRelativeTime(
  value: string | number | Date,
  { locale = DEFAULT_LOCALE, now = Date.now() } = {},
): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const diff = date.getTime() - now;
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  for (const [unit, ms] of RELATIVE_UNITS) {
    if (Math.abs(diff) >= ms || unit === "second") {
      return formatter.format(Math.round(diff / ms), unit);
    }
  }
  return formatter.format(0, "second");
}
