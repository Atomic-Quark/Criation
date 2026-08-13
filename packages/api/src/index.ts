import { createApiClient, type ApiClientOptions } from "./client";
import { createResources, type CriationApi } from "./resources";

export * from "./client";
export * from "./errors";
export * from "./resources";

/**
 * Convenience factory returning the typed resource surface.
 *
 * ```ts
 * const api = createCriationApi({ baseUrl: process.env.NEXT_PUBLIC_API_URL });
 * const { items } = await api.products.list({ status: "active" });
 * ```
 */
export function createCriationApi(options?: ApiClientOptions): CriationApi {
  return createResources(createApiClient(options));
}
