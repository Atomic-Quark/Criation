# Criation

Criation is developed as a single **npm workspaces + Turborepo** monorepo. The
customer website, the mobile app, the internal admin dashboard and the backend
API all live here and share the same types, utilities, API client, validation
schemas and configuration.

## Requirements

| Tool | Version    |
| ---- | ---------- |
| Node | >= 20.19.0 |
| npm  | >= 10      |

Mobile development additionally needs the [Expo Go](https://expo.dev/go) app or
an Android/iOS simulator.

## Getting started

```bash
git clone <repo-url> criation
cd criation

npm install          # installs every workspace from the repo root
cp .env.example .env # fill in local values; .env is git-ignored

npm run dev:backend  # http://localhost:4000
npm run dev:web      # http://localhost:3000
npm run dev:admin    # http://localhost:3001
npm run dev:mobile   # Expo dev server
```

`npm install` must be run **from the repository root**. Installing inside a
single app creates a nested `node_modules` that shadows the hoisted React and
React Native copies and breaks Metro.

## Repository layout

```
criation/
├── apps/
│   ├── web/          @criation/web      Next.js 16 customer website  (:3000)
│   ├── mobile/       @criation/mobile   Expo / React Native app
│   └── admin/        @criation/admin    Next.js 16 admin dashboard   (:3001)
│
├── backend/
│   └── api/          @criation/backend  Express 5 API and business logic (:4000)
│
├── packages/
│   ├── ui/           @criation/ui         Design tokens + web and native components
│   ├── types/        @criation/types      Shared interfaces, enums, API models
│   ├── utils/        @criation/utils      Formatting, collection, async helpers
│   ├── api/          @criation/api        Typed API client shared by all apps
│   ├── validation/   @criation/validation Zod schemas and validation helpers
│   └── config/       @criation/config     TS / ESLint / Prettier + runtime config
│
├── docs/             Architecture and workflow documentation
├── .env.example      Documented environment template (no secrets)
├── package.json      Workspace definitions and root scripts
├── tsconfig.json     Root TypeScript configuration
└── turbo.json        Task graph, caching and environment declarations
```

## Root commands

Every command runs from the repository root and fans out through Turborepo.

| Command                 | What it does                                            |
| ----------------------- | ------------------------------------------------------- |
| `npm install`           | Installs all workspaces into one hoisted `node_modules` |
| `npm run dev`           | Starts every app in parallel                            |
| `npm run dev:web`       | Next.js website on port 3000                            |
| `npm run dev:admin`     | Next.js admin dashboard on port 3001                    |
| `npm run dev:mobile`    | Expo dev server                                         |
| `npm run dev:backend`   | Express API on port 4000 with `tsx watch`               |
| `npm run build`         | Builds every application                                |
| `npm run build:<app>`   | Builds one app (`web`, `admin`, `mobile`, `backend`)    |
| `npm run start:backend` | Runs the compiled API from `backend/api/dist`           |
| `npm run lint`          | ESLint across every workspace                           |
| `npm run lint:fix`      | ESLint with `--fix`                                     |
| `npm run typecheck`     | `tsc --noEmit` across every workspace                   |
| `npm run format`        | Prettier write across the repo                          |
| `npm run format:check`  | Prettier check (use in CI)                              |
| `npm run check`         | lint + typecheck + format:check                         |
| `npm run clean`         | Removes build output from every workspace               |

To run a script in a single workspace directly:

```bash
npm run build --workspace=@criation/web
```

## Using shared packages

Shared packages publish their **TypeScript source** through the `exports` field
in `package.json`. There is no build step for them: Next.js compiles them via
`transpilePackages`, Metro transforms them through Babel, and the backend
bundles them with tsup. Editing `packages/utils/src/format.ts` is picked up by
every app on the next refresh.

```ts
import { createCriationApi } from "@criation/api";
import { API_ROUTES, resolveAppConfig } from "@criation/config";
import type { Product } from "@criation/types";
import { formatPrice, slugify } from "@criation/utils";
import { createProductSchema } from "@criation/validation";
```

`@criation/ui` has three entrypoints because React DOM and React Native
components cannot share one module:

```ts
import { colors, spacing } from "@criation/ui"; // tokens, any platform
import { Button, Card } from "@criation/ui/web"; // web + admin
import { Button, Card } from "@criation/ui/native"; // mobile
```

| Package                |  web   |  mobile   | admin  | backend |
| ---------------------- | :----: | :-------: | :----: | :-----: |
| `@criation/types`      |  yes   |    yes    |  yes   |   yes   |
| `@criation/utils`      |  yes   |    yes    |  yes   |   yes   |
| `@criation/validation` |  yes   |    yes    |  yes   |   yes   |
| `@criation/api`        |  yes   |    yes    |  yes   |    —    |
| `@criation/config`     |  yes   |    yes    |  yes   |   yes   |
| `@criation/ui`         | `/web` | `/native` | `/web` |    —    |

Full details, including how to add a new package or app, are in
[docs/monorepo.md](docs/monorepo.md).

## Environment configuration

`.env.example` is the single documented template. Copy it to `.env` and fill in
real values — `.env` and every `.env.*` file except the example are git-ignored.

Variables prefixed `NEXT_PUBLIC_` (Next.js) and `EXPO_PUBLIC_` (Expo) are
**inlined into the client bundle and are therefore public**. Secrets such as
`DATABASE_URL` and `JWT_SECRET` must only ever be read by `backend/api`.

Each app reads its own prefixed variables and passes them to the shared
`resolveAppConfig()` helper from `@criation/config`, which applies defaults and
validation in one place. See [docs/environment.md](docs/environment.md).

## Shared tooling

There is one copy of each tool configuration, all of it in `packages/config`:

- **TypeScript** — `packages/config/tsconfig/*.json`, extended by every workspace.
- **ESLint** — flat presets for base, Next.js, React Native and Node.
- **Prettier** — one config, re-exported by the root `prettier.config.mjs`.

Workspaces extend these rather than defining their own, so formatting and lint
rules cannot drift between apps.

## Documentation

- [docs/monorepo.md](docs/monorepo.md) — structure, tooling and how to add a workspace
- [docs/architecture.md](docs/architecture.md) — how the apps, packages and API fit together
- [docs/environment.md](docs/environment.md) — environment variables and configuration flow

## License

MIT — see [LICENSE](LICENSE).
