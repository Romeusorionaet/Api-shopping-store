import { FastifyInstance } from "fastify";
import { create } from "./create";
// import { verifyJWTAccessToken } from "../../middlewares/verify-jwt-access-token";

export async function orderRoutes(app: FastifyInstance) {
  app.post("/order/create", create);
}
