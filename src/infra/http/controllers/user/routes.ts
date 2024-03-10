import { FastifyInstance } from "fastify";
import { create } from "./create";
import { authenticate } from "./authenticate";
import { profile } from "./profile";
import { verifyJWT } from "../../middlewares/verify-jwt";

export async function registerUserRoutes(app: FastifyInstance) {
  app.post("/user/register", create);
  app.post("/user/authenticate", authenticate);

  app.get("/user/profile", { onRequest: [verifyJWT] }, profile);
}
