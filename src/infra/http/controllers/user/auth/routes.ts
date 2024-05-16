import { FastifyInstance } from "fastify";
import { registerWithGoogle } from "./register-with-google";
import { register } from "./register";
import { refreshToken } from "./refresh-token";
import { authenticate } from "./authenticate";
import { removeRefreshToken } from "./remove-refresh-token";
import { verifyJWTRefreshToken } from "src/infra/http/middlewares/verify-jwt-refresh-token";

export async function authRoutes(app: FastifyInstance) {
  app.post("/auth/register/oauth-google/callback", registerWithGoogle);
  app.post("/auth/user/register", register);
  app.post(
    "/auth/user/refresh-token",
    { onRequest: verifyJWTRefreshToken },
    refreshToken,
  );
  app.post("/auth/user/authenticate", authenticate);
  app.post("/auth/user/signUp", removeRefreshToken);
}
