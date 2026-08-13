# @criation/web

The customer-facing Criation website. Next.js 16 (App Router, Turbopack, React
Compiler) with Tailwind CSS 4.

```bash
npm run dev:web    # from the repo root -> http://localhost:3000
npm run build:web
```

- `src/app/` — routes and layouts
- `src/lib/config.ts` — runtime config from `NEXT_PUBLIC_*`
- `src/lib/api.ts` — pre-configured `@criation/api` client

Shared workspace packages are listed in `transpilePackages` in
[next.config.ts](next.config.ts); add new ones there.

Setup, environment variables and monorepo conventions live in the
[root README](../../README.md) and [docs/](../../docs).
