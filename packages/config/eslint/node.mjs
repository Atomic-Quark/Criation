import globals from "globals";
import tseslint from "typescript-eslint";

import base from "./base.mjs";

/** Shared ESLint config for server-side workspaces (backend/api). */
export default tseslint.config(...base, {
  languageOptions: {
    globals: { ...globals.node },
    sourceType: "module",
  },
});
