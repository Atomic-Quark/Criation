import js from "@eslint/js";
import tseslint from "typescript-eslint";

/**
 * Shared base ESLint config for Criation packages. Framework presets
 * (eslint/next.mjs, eslint/react-native.mjs) do not compose this — their
 * framework configs already register @typescript-eslint.
 */
export default tseslint.config(
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/coverage/**",
      "**/.next/**",
      "**/.expo/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
);
