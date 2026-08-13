# Environment configuration

## The rules

1. `.env.example` is the only committed environment file. It contains
   **placeholders only** — never a real credential.
2. Copy it to `.env` for local development. `.env` and every other `.env.*`
   file is git-ignored.
3. Anything prefixed `NEXT_PUBLIC_` or `EXPO_PUBLIC_` is **compiled into the
   client bundle and is public**. Never put a secret behind those prefixes.
4. Secrets (`DATABASE_URL`, `JWT_SECRET`) are read by `backend/api` only.

```bash
cp .env.example .env
```

## How a value reaches an app

Bundlers replace `process.env.SOME_KEY` with a literal at build time, which only
works when the key is written out in full. A shared helper therefore cannot read
`process.env` on an app's behalf. Instead each app reads its own keys literally
and passes them to `resolveAppConfig()` from `@criation/config`, which applies
defaults, normalisation and validation in one place.

```ts
// apps/web/src/lib/config.ts
import { resolveAppConfig } from "@criation/config";

export const appConfig = resolveAppConfig({
  appName: process.env.NEXT_PUBLIC_APP_NAME,
  apiUrl: process.env.NEXT_PUBLIC_API_URL,
  environment: process.env.NEXT_PUBLIC_APP_ENV,
});
```

`resolveAppConfig` never throws: an unset or malformed value falls back to the
documented default, so a missing variable cannot crash an app at import time.
Use `requireEnv()` in server-side code where a misconfigured deployment should
fail loudly at boot instead.

## Variables

### Shared

| Variable  | Default       | Purpose                               |
| --------- | ------------- | ------------------------------------- |
| `APP_ENV` | `development` | `development`, `test` or `production` |

### `backend/api`

| Variable         | Default                                       | Purpose                             |
| ---------------- | --------------------------------------------- | ----------------------------------- |
| `PORT`           | `4000`                                        | Port the API listens on             |
| `CORS_ORIGINS`   | `http://localhost:3000,http://localhost:3001` | Comma-separated allowed origins     |
| `DATABASE_URL`   | —                                             | Postgres connection string (secret) |
| `JWT_SECRET`     | —                                             | Session signing key (secret)        |
| `JWT_EXPIRES_IN` | `7d`                                          | Access-token lifetime               |

The backend loads the repo-root `.env` through Node's built-in
`process.loadEnvFile`, so it has no dotenv dependency. A missing file is not an
error — deployments inject real environment variables instead.

### `apps/web` (public)

| Variable               | Default                 |
| ---------------------- | ----------------------- |
| `NEXT_PUBLIC_APP_NAME` | `Criation`              |
| `NEXT_PUBLIC_API_URL`  | `http://localhost:4000` |
| `NEXT_PUBLIC_APP_ENV`  | `development`           |

### `apps/admin` (public)

| Variable                     | Default                 |
| ---------------------------- | ----------------------- |
| `NEXT_PUBLIC_ADMIN_APP_NAME` | `Criation Admin`        |
| `NEXT_PUBLIC_ADMIN_API_URL`  | `http://localhost:4000` |

### `apps/mobile` (public)

| Variable               | Default                 |
| ---------------------- | ----------------------- |
| `EXPO_PUBLIC_APP_NAME` | `Criation`              |
| `EXPO_PUBLIC_API_URL`  | `http://localhost:4000` |
| `EXPO_PUBLIC_APP_ENV`  | `development`           |

On a physical device, `localhost` points at the phone. Set `EXPO_PUBLIC_API_URL`
to your machine's LAN address (for example `http://192.168.1.20:4000`) and add
that origin to `CORS_ORIGINS`.

## Turborepo caching

`turbo.json` declares which variables affect a build:

```json
"build": {
  "env": ["NEXT_PUBLIC_*", "EXPO_PUBLIC_*", "API_URL", "PORT", "CORS_ORIGINS", "APP_ENV"]
}
```

Changing any of them invalidates the cached build. A new build-time variable
must be added to that list, or Turborepo will serve a stale artifact.

## Adding a variable

1. Document it in `.env.example` with a safe placeholder.
2. Add it to the relevant table above.
3. If it affects a build, add it to `turbo.json`'s `build.env`.
4. If an app needs it at runtime, read it literally in that app's
   `src/lib/config.ts` and extend `AppConfigOverrides` in
   `packages/config/src/env.ts` when the value is shared across apps.
