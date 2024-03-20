import { FastifyInstance } from "fastify";
import { create } from "./create";

export async function orderRoutes(app: FastifyInstance) {
  app.post("/order/create", create);
}
