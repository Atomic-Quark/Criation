// Metro configuration for a workspace-hoisted monorepo.
// https://docs.expo.dev/guides/monorepo/
const path = require("node:path");

const { getDefaultConfig } = require("expo/metro-config");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// 1. Watch the whole repo so edits in packages/* trigger a fast refresh.
config.watchFolders = [workspaceRoot];

// 2. Resolve modules from the app first, then the hoisted root node_modules.
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

// 3. Only use the paths above, so a stray nested node_modules cannot shadow
//    the hoisted copy of React or React Native.
config.resolver.disableHierarchicalLookup = true;

// 4. Shared packages expose subpaths such as `@criation/ui/native` through the
//    package.json "exports" field.
config.resolver.unstable_enablePackageExports = true;

module.exports = config;
