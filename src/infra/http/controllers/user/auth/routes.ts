import { FastifyInstance } from "fastify";
import { registerWithGoogle } from "./register-with-google";
import { register } from "./register";
import { refreshToken } from "./refresh-token";
import { authenticate } from "./authenticate";

export async function authRoutes(app: FastifyInstance) {
  app.get("/auth/register/oauth-google", registerWithGoogle);
  app.post("/auth/user/register", register);
  app.post("/auth/user/refresh-token", refreshToken);
  app.post("/auth/user/authenticate", authenticate);
}