import { FastifyInstance } from "fastify";
import { create } from "./create";
import { verifyJWT } from "../../middlewares/verify-jwt";

export async function orderRoutes(app: FastifyInstance) {
  app.post("/order/create", { onRequest: [verifyJWT] }, create);
}
