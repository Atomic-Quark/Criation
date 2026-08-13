import { resolveAppConfig, type AppConfig } from "@criation/config";
import { DEV_PORTS } from "@criation/config";

/**
 * Loads the repo-root `.env` when present. Node's built-in loader means the
 * service has no dotenv dependency; a missing file is not an error because
 * production deployments inject real environment variables instead.
 */
function loadDotEnv(): void {
  if (typeof process.loadEnvFile !== "function") return;
  for (const file of [".env.local", ".env"]) {
    try {
      process.loadEnvFile(new URL(`../../../${file}`, import.meta.url).pathname);
    } catch {
      // File absent or unreadable — fall back to the ambient environment.
    }
  }
}

export interface ServerConfig extends AppConfig {
  port: number;
  corsOrigins: string[];
}

export function loadServerConfig(): ServerConfig {
  loadDotEnv();

  const app = resolveAppConfig({
    appName: process.env.APP_NAME,
    environment: process.env.APP_ENV ?? process.env.NODE_ENV,
    apiUrl: process.env.API_URL,
  });

  const port = Number.parseInt(process.env.PORT ?? "", 10);
  const corsOrigins = (process.env.CORS_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return {
    ...app,
    port: Number.isInteger(port) && port > 0 ? port : DEV_PORTS.backend,
    corsOrigins:
      corsOrigins.length > 0
        ? corsOrigins
        : [`http://localhost:${DEV_PORTS.web}`, `http://localhost:${DEV_PORTS.admin}`],
  };
}
