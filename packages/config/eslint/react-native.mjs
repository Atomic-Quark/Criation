import { defineConfig, globalIgnores } from "eslint/config";
import expoConfig from "eslint-config-expo/flat.js";

/**
 * Shared ESLint config for the Criation Expo app (apps/mobile).
 * eslint-config-expo already brings @typescript-eslint, so this does not
 * compose eslint/base.mjs.
 */
export default defineConfig([
  globalIgnores([
    "**/node_modules/**",
    "**/dist/**",
    "**/build/**",
    "**/coverage/**",
    ".expo/**",
    "expo-env.d.ts",
  ]),
  expoConfig,
  {
    // Scoped to TS files — eslint-config-expo registers the plugin there.
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
]);
