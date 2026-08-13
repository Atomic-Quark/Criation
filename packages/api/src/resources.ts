import { API_ROUTES } from "@criation/config";
import type {
  Category,
  Credentials,
  Order,
  Paginated,
  Product,
  ProductFilters,
  ProductSummary,
  Session,
  User,
} from "@criation/types";

import type { ApiClient, QueryParams, RequestOptions } from "./client";

export interface ProductListQuery extends ProductFilters {
  page?: number;
  pageSize?: number;
}

function toQueryParams(query: ProductListQuery = {}): QueryParams {
  const { tags, ...rest } = query;
  return { ...rest, ...(tags ? { tags } : {}) };
}

/**
 * Typed resource methods layered on top of `ApiClient`. Web, admin, mobile and
 * server-side code all talk to the backend through this single surface.
 */
export function createResources(client: ApiClient) {
  return {
    health: () => client.get<{ status: string }>(API_ROUTES.health, { anonymous: true }),

    products: {
      list: (query?: ProductListQuery, options?: RequestOptions) =>
        client.get<Paginated<ProductSummary>>(API_ROUTES.products, {
          ...options,
          query: toQueryParams(query),
        }),
      byId: (id: string, options?: RequestOptions) =>
        client.get<Product>(API_ROUTES.product(id), options),
      create: (input: unknown, options?: RequestOptions) =>
        client.post<Product>(API_ROUTES.products, input, options),
      update: (id: string, input: unknown, options?: RequestOptions) =>
        client.patch<Product>(API_ROUTES.product(id), input, options),
      remove: (id: string, options?: RequestOptions) =>
        client.delete<void>(API_ROUTES.product(id), options),
    },

    categories: {
      list: (options?: RequestOptions) => client.get<Category[]>(API_ROUTES.categories, options),
    },

    orders: {
      list: (query?: { page?: number; pageSize?: number }, options?: RequestOptions) =>
        client.get<Paginated<Order>>(API_ROUTES.orders, { ...options, query }),
      create: (input: unknown, options?: RequestOptions) =>
        client.post<Order>(API_ROUTES.orders, input, options),
    },

    auth: {
      login: (credentials: Credentials, options?: RequestOptions) =>
        client.post<Session>(API_ROUTES.login, credentials, {
          ...options,
          anonymous: true,
        }),
      me: (options?: RequestOptions) => client.get<User>(API_ROUTES.me, options),
    },
  };
}

export type CriationApi = ReturnType<typeof createResources>;
