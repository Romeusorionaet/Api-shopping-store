import { FastifyInstance } from "fastify";
import { authenticate } from "./authenticate";
import { register } from "./register";

export async function userRoutes(app: FastifyInstance) {
  app.post("/user/register", register);
  app.post("/user/authenticate", authenticate);
}
