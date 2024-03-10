import { FastifyInstance } from "fastify";
import { create } from "./create";
import { authenticate } from "./authenticate";

export async function registerUserRoutes(app: FastifyInstance) {
  app.post("/register/user", create);
  app.post("/authenticate/user", authenticate);
}
