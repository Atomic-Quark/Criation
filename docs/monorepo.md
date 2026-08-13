# Monorepo guide

This document explains how the Criation monorepo is put together, why the
choices were made, and how to extend it.

## Tooling

| Concern            | Choice               | Why                                                                    |
| ------------------ | -------------------- | ---------------------------------------------------------------------- |
| Package management | npm workspaces       | Already the project's package manager; no extra runtime to install     |
| Task orchestration | Turborepo            | Task graph, parallelism and caching for `build` / `lint` / `typecheck` |
| Language           | TypeScript           | One version at the root, one base config extended by every workspace   |
| Linting            | ESLint 9 flat config | Presets shared from `@criation/config`                                 |
| Formatting         | Prettier             | One config, re-exported by the root `prettier.config.mjs`              |

`workspaces` in the root `package.json` covers `apps/*`, `packages/*` and
`backend/*`, so every directory in those three trees with a `package.json` is
part of the workspace automatically.

## Just-in-time shared packages

Shared packages are **not built**. Each one points its `exports` map straight at
TypeScript source:

```json
{
  "name": "@criation/utils",
  "type": "module",
  "exports": {
    ".": "./src/index.ts"
  }
}
```

Each consumer compiles that source itself:

| Consumer      | Mechanism                                                         |
| ------------- | ----------------------------------------------------------------- |
| `apps/web`    | `transpilePackages` in `next.config.ts`                           |
| `apps/admin`  | `transpilePackages` in `next.config.ts`                           |
| `apps/mobile` | Metro + `babel-preset-expo` (all workspace files are transformed) |
| `backend/api` | `tsx` in development, `tsup` with `noExternal: [/^@criation\//]`  |

The upside is that there is no build ordering, no stale `dist/` and no watch
step: a change in `packages/*/src` is live everywhere on the next refresh. The
trade-off is that any new consumer must be able to compile TypeScript, which is
true of all four applications.

## TypeScript

`packages/config/tsconfig/` holds the shared compiler options:

| File                | Used by                                    |
| ------------------- | ------------------------------------------ |
| `base.json`         | everything (extended, never used directly) |
| `library.json`      | `packages/*`                               |
| `nextjs.json`       | `apps/web`, `apps/admin`                   |
| `react-native.json` | `apps/mobile`                              |
| `node.json`         | `backend/api`                              |

A workspace config is then three lines:

```json
{
  "extends": "@criation/config/tsconfig/library.json",
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

Cross-package imports need **no path aliases**. npm symlinks each workspace into
`node_modules/@criation/*`, and TypeScript resolves `@criation/types` through
that symlink and the package's `exports` map. The `paths` block in the root
`tsconfig.json` exists only so editors can jump to source from files that are
not part of any workspace program.

`apps/*` keep their own `@/*` alias for app-local imports.

## ESLint

`packages/config/eslint/` exports four flat presets:

| Preset       | Import specifier                           | Used by      |
| ------------ | ------------------------------------------ | ------------ |
| base         | `@criation/config/eslint`                  | `packages/*` |
| Next.js      | `@criation/config/eslint/next.mjs`         | web, admin   |
| React Native | `@criation/config/eslint/react-native.mjs` | mobile       |
| Node         | `@criation/config/eslint/node.mjs`         | backend      |

The Next.js and React Native presets deliberately do **not** compose the base
preset: `eslint-config-next` and `eslint-config-expo` already register
`@typescript-eslint`, and flat config rejects a plugin being defined twice.

A workspace config is two lines:

```js
import next from "@criation/config/eslint/next.mjs";

export default next;
```

## Turborepo task graph

`turbo.json` declares the tasks:

- `build` — depends on `^build` (upstream workspaces first) and caches
  `.next/**`, `dist/**`, `build/**`.
- `dev` / `start` — `cache: false`, `persistent: true`.
- `lint`, `typecheck` — no outputs, cached on inputs.
- `clean` — `cache: false`.

Environment variables that affect a build are declared in the `build.env` list
so Turborepo invalidates the cache when they change.

Turborepo skips workspaces that do not define a given script, so a package with
no `build` script simply never appears in the build graph.

## Adding a shared package

1. `mkdir packages/<name>/src`
2. Add `packages/<name>/package.json`:

   ```json
   {
     "name": "@criation/<name>",
     "version": "0.1.0",
     "private": true,
     "type": "module",
     "sideEffects": false,
     "exports": {
       ".": "./src/index.ts",
       "./package.json": "./package.json"
     },
     "scripts": {
       "lint": "eslint .",
       "typecheck": "tsc --noEmit"
     },
     "devDependencies": {
       "@criation/config": "*",
       "eslint": "^9.39.0"
     }
   }
   ```

3. Add `tsconfig.json` extending `@criation/config/tsconfig/library.json` and
   `eslint.config.mjs` re-exporting `@criation/config/eslint`.
4. Create `src/index.ts`.
5. Add `"@criation/<name>": "*"` to each consuming workspace's `dependencies`.
6. For the Next.js apps, add the package to `transpilePackages` in
   `next.config.ts`.
7. Run `npm install` at the root so the symlinks are created.

## Adding an application

Create the directory under `apps/`, give it a `package.json` named
`@criation/<app>` with `dev`, `build`, `lint` and `typecheck` scripts, extend
the matching shared tsconfig and ESLint preset, then add `dev:<app>` and
`build:<app>` shortcuts to the root `package.json`.

## Conventions

- **Never run `npm install` inside an app directory.** It creates a nested
  `node_modules` that shadows the hoisted React / React Native copies and breaks
  Metro's resolver. Always install from the repo root.
- **One lockfile**, at the root. Per-app lockfiles must not be committed.
- **One version of React, React Native and TypeScript**, pinned so npm hoists a
  single copy. Bump them together across all workspaces.
- **Shared config lives in `packages/config`.** Do not copy tsconfig, ESLint or
  Prettier settings into an app.
- Money is always stored as an **integer in the smallest currency unit** and
  formatted with `formatPrice` from `@criation/utils`.

## Troubleshooting

**`Cannot find module '@criation/...'`** — run `npm install` from the root; the
workspace symlink is missing.

**Metro cannot resolve a shared package** — check `apps/mobile/metro.config.js`
still lists the workspace root in `watchFolders` and `nodeModulesPaths`, then
restart with `npx expo start --clear`.

**`LayoutProps` is not defined in a Next.js app** — the generated route types
are missing. `npm run typecheck` runs `next typegen` first; run it manually with
`npm run typecheck --workspace=@criation/web`.

**Turborepo reports `Could not resolve workspace`** — the root `package.json`
lost its `packageManager` field.
