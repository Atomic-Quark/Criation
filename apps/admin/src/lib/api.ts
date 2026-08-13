import { createCriationApi } from "@criation/api";

import { appConfig } from "./config";

/** Shared Criation API client, pre-configured for the admin dashboard. */
export const api = createCriationApi({
  baseUrl: appConfig.apiUrl,
  timeoutMs: appConfig.apiTimeoutMs,
});
