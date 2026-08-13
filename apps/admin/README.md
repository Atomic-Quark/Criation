# @criation/admin

The internal Criation administration dashboard. Same stack as
[`@criation/web`](../web) — Next.js 16 with Tailwind CSS 4 — running on port
3001 so both can be developed side by side.

```bash
npm run dev:admin    # from the repo root -> http://localhost:3001
npm run build:admin
```

Reads `NEXT_PUBLIC_ADMIN_*` variables, so the dashboard can point at a different
API host than the storefront.

Setup, environment variables and monorepo conventions live in the
[root README](../../README.md) and [docs/](../../docs).
