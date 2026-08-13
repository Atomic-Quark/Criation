# @criation/mobile

The Criation Android and iOS application. Expo SDK 57 / React Native 0.86.

```bash
npm run dev:mobile     # from the repo root -> Expo dev server
npm run build:mobile   # metro bundle into apps/mobile/dist
```

Release builds for the app stores go through [EAS Build](https://docs.expo.dev/build/introduction/);
`build:mobile` only produces the JavaScript bundle.

[metro.config.js](metro.config.js) is configured for the workspace layout — the
repo root is watched, resolution is pinned to the app and root `node_modules`,
and package `exports` are enabled so `@criation/ui/native` resolves. Never run
`npm install` in this directory: a nested `node_modules` shadows the hoisted
React Native copy and breaks the bundler.

Use `@criation/ui/native` for components; `@criation/ui/web` will not resolve
here. On a physical device, point `EXPO_PUBLIC_API_URL` at your machine's LAN
address rather than `localhost`.

Setup, environment variables and monorepo conventions live in the
[root README](../../README.md) and [docs/](../../docs).
