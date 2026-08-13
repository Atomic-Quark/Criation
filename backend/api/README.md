# @criation/backend

The central Criation API and business-logic layer. Express 5 on port 4000,
validating requests with the same `@criation/validation` schemas the clients use.

```bash
npm run dev:backend     # from the repo root -> tsx watch, http://localhost:4000
npm run build:backend   # tsup -> backend/api/dist/index.js
npm run start:backend   # node dist/index.js
```

## Layout

| Path              | Responsibility                                         |
| ----------------- | ------------------------------------------------------ |
| `src/index.ts`    | Bootstrap: load config, listen, handle signals         |
| `src/server.ts`   | `createServer(config)` — mountable without a port      |
| `src/env.ts`      | `process.env` -> `ServerConfig`                        |
| `src/lib/`        | Response envelopes and pagination                      |
| `src/middleware/` | Request validation, 404 and error handling             |
| `src/routes/`     | `health`, `products`, `auth`                           |
| `src/data/`       | In-memory seed catalogue, replaced by a real datastore |

## Endpoints

| Method | Path                | Notes                                |
| ------ | ------------------- | ------------------------------------ |
| GET    | `/health`           | Service status and uptime            |
| GET    | `/api/products`     | Filtered and paginated summaries     |
| GET    | `/api/products/:id` | Accepts an id or a slug              |
| POST   | `/api/products`     | Validated with `createProductSchema` |
| GET    | `/api/categories`   | All categories                       |
| POST   | `/api/auth/login`   | Placeholder session issuance         |
| GET    | `/api/auth/me`      | Requires a bearer token              |

Every response uses the shared envelope: `{ success: true, data }` or
`{ success: false, error: { code, message, fields? } }`.

Validated input is read from `res.locals` via the `validated()` helper, because
Express 5 exposes `req.query` as a read-only getter.

Setup, environment variables and monorepo conventions live in the
[root README](../../README.md) and [docs/](../../docs).
