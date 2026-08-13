import { loadServerConfig } from "./env";
import { createServer } from "./server";

const config = loadServerConfig();
const app = createServer(config);

const server = app.listen(config.port, () => {
  console.info(
    `[criation-api] ${config.environment} server listening on http://localhost:${config.port}`,
  );
});

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => {
    console.info(`[criation-api] received ${signal}, shutting down`);
    server.close(() => process.exit(0));
  });
}
