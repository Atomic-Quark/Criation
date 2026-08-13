export * from "./env";

/** Routes the backend exposes, shared so clients never hardcode strings. */
export const API_ROUTES = {
  health: "/health",
  products: "/api/products",
  product: (id: string) => `/api/products/${id}`,
  categories: "/api/categories",
  orders: "/api/orders",
  login: "/api/auth/login",
  me: "/api/auth/me",
} as const;

/** Pagination defaults shared by the API, web, admin and mobile clients. */
export const PAGINATION = {
  defaultPage: 1,
  defaultPageSize: 20,
  maxPageSize: 100,
} as const;

/** Ports each workspace uses during local development. */
export const DEV_PORTS = {
  web: 3000,
  admin: 3001,
  backend: 4000,
} as const;
