import cors from "cors";
import express, { type Express } from "express";

import type { ServerConfig } from "./env";
import { errorHandler, notFoundHandler } from "./middleware/error";
import { authRouter } from "./routes/auth";
import { healthRouter } from "./routes/health";
import { productsRouter } from "./routes/products";

/**
 * Builds the Express app. Kept separate from `index.ts` so tests can mount the
 * app without binding a port.
 */
export function createServer(config: ServerConfig): Express {
  const app = express();

  app.disable("x-powered-by");
  app.use(cors({ origin: config.corsOrigins, credentials: true }));
  app.use(express.json({ limit: "1mb" }));

  app.use(healthRouter(config));
  app.use("/api", productsRouter());
  app.use("/api", authRouter());

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
