# Architecture

## Overview

```
                        ┌──────────────────────────┐
   apps/web  ──────────▶│                          │
   apps/admin ─────────▶│   backend/api  (:4000)   │
   apps/mobile ────────▶│   Express 5 + Zod        │
                        └──────────────────────────┘
        │                            │
        └──────────────┬─────────────┘
                       ▼
        packages/api · types · validation · utils · config · ui
```

Every application talks to the backend through `@criation/api`, which returns
values typed with `@criation/types`. The backend validates incoming payloads
with the same `@criation/validation` schemas the clients use for their forms, so
a rule is written once and enforced on both sides.

## Applications

### `apps/web` — `@criation/web`

Next.js 16 App Router with Turbopack, React Compiler and Tailwind CSS 4. Serves
the customer-facing store on port 3000. `src/lib/config.ts` resolves the runtime
config from `NEXT_PUBLIC_*` variables and `src/lib/api.ts` exposes a
pre-configured API client.

### `apps/admin` — `@criation/admin`

Same stack as web, on port 3001, for internal operations. Reads
`NEXT_PUBLIC_ADMIN_*` variables so it can point at a different API host than the
storefront.

### `apps/mobile` — `@criation/mobile`

Expo SDK 57 / React Native 0.86. `metro.config.js` is configured for the
workspace layout: the repo root is watched, module resolution is pinned to the
app and root `node_modules`, hierarchical lookup is disabled so a stray nested
install cannot shadow React Native, and package `exports` are enabled so
`@criation/ui/native` resolves.

### `backend/api` — `@criation/backend`

Express 5 on port 4000.

```
src/
├── index.ts              bootstrap: config, listen, signal handling
├── server.ts             createServer(config) -> Express app
├── env.ts                reads process.env into a ServerConfig
├── lib/http.ts           ApiSuccess / ApiFailure envelopes, pagination
├── middleware/
│   ├── error.ts          404 + terminal error handler
│   └── validate.ts       validateRequest(schema, "body" | "query" | "params")
├── routes/               health, products, auth
└── data/catalog.ts       in-memory seed data
```

`createServer` is separate from `index.ts` so tests can mount the app without
binding a port. Development runs under `tsx watch`; production builds a single
bundled ESM file with tsup.

Route handlers read validated input from `res.locals` rather than mutating the
request, because Express 5 exposes `req.query` as a read-only getter.

## Shared packages

### `@criation/types`

Interfaces, enums-as-const-objects and API models: `Product`, `Category`,
`Order`, `User`, `Session`, plus the `ApiResponse<T>` / `Paginated<T>`
envelopes. No runtime dependencies.

Enums are `const` objects with a matching type rather than TypeScript `enum`,
so the package stays compatible with `isolatedModules` and every bundler in the
repo.

### `@criation/utils`

`formatPrice`, `formatDate`, `formatRelativeTime`, `slugify`, `truncate`,
`groupBy`, `chunk`, `pick`, `omit`, `retry`, `withTimeout`, `isDefined`,
`toErrorMessage`. Pure functions with no platform APIs, so the same build runs
in the browser, in React Native and in Node.

### `@criation/validation`

Zod 4 schemas mirroring the shared types, plus `validate()` which never throws
and flattens issues into `{ "path.to.field": ["message"] }` — the exact shape of
`ApiError.fields`. The backend returns that map, and client forms can render it
without a translation layer.

### `@criation/api`

`ApiClient` wraps `fetch` with a timeout, bearer-token injection, query-string
serialisation and envelope unwrapping, throwing `ApiClientError` (carrying
`code`, `status`, `fields` and `isRetryable`) on failure. `createResources`
layers typed methods (`api.products.list()`, `api.auth.login()`) on top, with
paths from `API_ROUTES` in `@criation/config` so no URL is written twice.

`fetch` is injectable, so tests and alternative runtimes can supply their own.

### `@criation/ui`

Three entrypoints:

- `@criation/ui` — design tokens (`colors`, `spacing`, `radii`, `fontSizes`) and
  the variant resolvers, with no platform imports.
- `@criation/ui/web` — `Button`, `Badge`, `Card`, `PriceTag` for React DOM.
- `@criation/ui/native` — the same four components for React Native.

The two platform implementations share `resolveButtonColors`, `resolveBadgeColors`
and `buttonSizing`, so a token change moves web and mobile together. Components
use inline styles rather than utility classes, so they work in any app whether
or not it uses Tailwind.

### `@criation/config`

Both build-time and runtime configuration:

- `tsconfig/*.json`, `eslint/*.mjs`, `prettier/index.mjs` — shared tooling.
- `src/index.ts` — `API_ROUTES`, `PAGINATION`, `DEV_PORTS`.
- `src/env.ts` — `resolveAppConfig()`, `DEFAULT_APP_CONFIG`, `requireEnv()`.

## Conventions

- **Money** is an integer in the smallest currency unit (paise, cents) with a
  separate ISO 4217 currency code. Formatting goes through `formatPrice`, which
  knows about zero-decimal currencies.
- **Timestamps** are ISO 8601 strings in transport types; `Date` objects only
  appear inside formatting helpers.
- **API responses** always use the `{ success: true, data }` /
  `{ success: false, error }` envelope. `ApiClient` unwraps it so callers work
  with plain data.
- **Server-rendered pages avoid `Date.now()` during render** — the React
  Compiler lint rejects it, and it causes hydration mismatches. Pass timestamps
  in as data instead.
