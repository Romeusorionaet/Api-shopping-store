import { FastifyInstance } from "fastify";
import { registerWithGoogle } from "./register-with-google";
import { register } from "./register";
import { refreshToken } from "./refresh-token";
import { authenticate } from "./authenticate";
import { verifyJWTRefreshToken } from "src/infra/http/middlewares/verify-jwt-refresh-token";

export async function authRoutes(app: FastifyInstance) {
  app.post("/auth/register/oauth-google/callback", registerWithGoogle);
  app.post("/auth/user/register", register);
  app.get(
    "/auth/user/refresh-token",
    { onRequest: verifyJWTRefreshToken },
    refreshToken,
  );
  app.post("/auth/user/authenticate", authenticate);
}
