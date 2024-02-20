import { FastifyInstance } from "fastify";
import { create } from "./create";

export async function categoriesRoutes(app: FastifyInstance) {
  app.post("/category", create);
}
