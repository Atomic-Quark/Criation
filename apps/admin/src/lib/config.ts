import { resolveAppConfig } from "@criation/config";

/**
 * Next.js inlines `process.env.NEXT_PUBLIC_*` at build time, so the values are
 * read here with literal keys and handed to the shared resolver.
 */
export const appConfig = resolveAppConfig({
  appName: process.env.NEXT_PUBLIC_ADMIN_APP_NAME ?? "Criation Admin",
  apiUrl: process.env.NEXT_PUBLIC_ADMIN_API_URL,
  environment: process.env.NEXT_PUBLIC_APP_ENV,
});
