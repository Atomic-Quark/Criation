import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Shared workspace packages ship TypeScript source, so Next compiles them
  // as part of this app instead of expecting pre-built JavaScript.
  transpilePackages: [
    "@criation/api",
    "@criation/config",
    "@criation/types",
    "@criation/ui",
    "@criation/utils",
    "@criation/validation",
  ],
};

export default nextConfig;
