/**
 * Environment plumbing shared by every Criation app.
 *
 * Bundlers inline `process.env.SOME_KEY` statically, so this module never
 * reads `process.env` with a computed key. Each app passes the values it
 * already has (`process.env.NEXT_PUBLIC_API_URL`, `process.env.EXPO_PUBLIC_API_URL`,
 * ...) into `resolveAppConfig`, and the shared defaults/validation live here.
 */

export type AppEnvironment = "development" | "test" | "production";

export interface AppConfig {
  /** Human readable product name, used in titles and headers. */
  appName: string;
  /** Which environment the app believes it is running in. */
  environment: AppEnvironment;
  /** Base URL of the Criation backend API, without a trailing slash. */
  apiUrl: string;
  /** Request timeout in milliseconds for API calls. */
  apiTimeoutMs: number;
  /** Default ISO 4217 currency code for price formatting. */
  defaultCurrency: string;
  /** Default BCP 47 locale for date and number formatting. */
  defaultLocale: string;
}

export interface AppConfigOverrides {
  appName?: string | undefined;
  environment?: string | undefined;
  apiUrl?: string | undefined;
  apiTimeoutMs?: number | string | undefined;
  defaultCurrency?: string | undefined;
  defaultLocale?: string | undefined;
}

export const DEFAULT_APP_CONFIG: AppConfig = {
  appName: "Criation",
  environment: "development",
  apiUrl: "http://localhost:4000",
  apiTimeoutMs: 15_000,
  defaultCurrency: "INR",
  defaultLocale: "en-IN",
};

function isAppEnvironment(value: unknown): value is AppEnvironment {
  return value === "development" || value === "test" || value === "production";
}

function stripTrailingSlash(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function toPositiveInt(value: number | string | undefined): number | undefined {
  if (value === undefined) return undefined;
  const parsed = typeof value === "number" ? value : Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

/**
 * Merges caller supplied environment values over the shared defaults.
 * Unknown or malformed values fall back to the default rather than throwing,
 * so a missing variable can never crash an app at import time.
 */
export function resolveAppConfig(overrides: AppConfigOverrides = {}): AppConfig {
  return {
    appName: overrides.appName?.trim() || DEFAULT_APP_CONFIG.appName,
    environment: isAppEnvironment(overrides.environment)
      ? overrides.environment
      : DEFAULT_APP_CONFIG.environment,
    apiUrl: stripTrailingSlash(overrides.apiUrl?.trim() || DEFAULT_APP_CONFIG.apiUrl),
    apiTimeoutMs: toPositiveInt(overrides.apiTimeoutMs) ?? DEFAULT_APP_CONFIG.apiTimeoutMs,
    defaultCurrency: overrides.defaultCurrency?.trim() || DEFAULT_APP_CONFIG.defaultCurrency,
    defaultLocale: overrides.defaultLocale?.trim() || DEFAULT_APP_CONFIG.defaultLocale,
  };
}

/**
 * Throws when a required value is missing. Use in server-side code where a
 * misconfigured deployment should fail loudly at boot instead of silently
 * falling back to a development default.
 */
export function requireEnv(name: string, value: string | undefined): string {
  if (!value || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}
