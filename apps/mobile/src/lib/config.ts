import { resolveAppConfig } from "@criation/config";

/**
 * Expo inlines `process.env.EXPO_PUBLIC_*` at build time, so the values are
 * read here with literal keys and handed to the shared resolver.
 */
export const appConfig = resolveAppConfig({
  appName: process.env.EXPO_PUBLIC_APP_NAME,
  apiUrl: process.env.EXPO_PUBLIC_API_URL,
  environment: process.env.EXPO_PUBLIC_APP_ENV,
});
