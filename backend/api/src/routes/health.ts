import { Router } from "express";

import { sendSuccess } from "../lib/http";
import type { ServerConfig } from "../env";

export function healthRouter(config: ServerConfig): Router {
  const router = Router();

  router.get("/health", (_req, res) => {
    sendSuccess(res, {
      status: "ok",
      service: "criation-api",
      environment: config.environment,
      uptimeSeconds: Math.round(process.uptime()),
    });
  });

  return router;
}
