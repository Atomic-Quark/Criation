import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "dist",
  format: ["esm"],
  target: "node20",
  platform: "node",
  clean: true,
  sourcemap: true,
  // Shared workspace packages ship TypeScript source, so they are compiled
  // into the bundle rather than treated as runtime dependencies.
  noExternal: [/^@criation\//],
});
