import { ApiErrorCode, UserRole, type Session, type User } from "@criation/types";
import { credentialsSchema, type CredentialsInput } from "@criation/validation";
import { Router } from "express";

import { sendError, sendSuccess } from "../lib/http";
import { validateRequest, validated } from "../middleware/validate";

const DEMO_USER: User = {
  id: "usr_demo",
  email: "demo@criation.example",
  name: "Demo User",
  role: UserRole.Customer,
  avatarUrl: null,
  emailVerified: true,
  createdAt: "2026-01-15T10:00:00.000Z",
  updatedAt: "2026-01-15T10:00:00.000Z",
};

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Placeholder auth so the monorepo wiring can be exercised end to end.
 * Real credential storage and token signing arrive with the auth ticket.
 */
export function authRouter(): Router {
  const router = Router();

  router.post("/auth/login", validateRequest(credentialsSchema), (_req, res) => {
    const credentials = validated<Required<CredentialsInput>>(res);

    if (credentials.email !== DEMO_USER.email) {
      sendError(res, 401, ApiErrorCode.Unauthorized, "Invalid email or password");
      return;
    }

    const session: Session = {
      user: DEMO_USER,
      accessToken: "demo-access-token",
      expiresAt: Date.now() + SESSION_TTL_MS,
    };
    sendSuccess(res, session);
  });

  router.get("/auth/me", (req, res) => {
    const header = req.get("authorization");
    if (!header?.startsWith("Bearer ")) {
      sendError(res, 401, ApiErrorCode.Unauthorized, "Missing bearer token");
      return;
    }
    sendSuccess(res, DEMO_USER);
  });

  return router;
}
