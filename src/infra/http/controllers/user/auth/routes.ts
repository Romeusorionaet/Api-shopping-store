import { FastifyInstance } from "fastify";
import { register } from "./register";
import { refreshToken } from "./refresh-token";
import { authenticate } from "./authenticate";
import { verifyJWTRefreshToken } from "src/infra/http/middlewares/verify-jwt-refresh-token";
import { confirmEmail } from "./confirm-email";
import { registerWithOAuth } from "./register-with-oauth";

export async function authRoutes(app: FastifyInstance) {
  app.post("/auth/register/oauth/callback", registerWithOAuth);
  app.post("/auth/user/register", register);
  app.get(
    "/auth/user/refresh-token",
    { onRequest: verifyJWTRefreshToken },
    refreshToken,
  );
  app.post("/auth/user/authenticate", authenticate);
  app.post("/auth/confirm-email/:token", confirmEmail);
}
