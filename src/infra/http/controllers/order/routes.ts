import { FastifyInstance } from "fastify";
import { create } from "./create";
import { verifyJWT } from "../../middlewares/verify-jwt";
import { paymentSuccess } from "./payment-success";

export async function orderRoutes(app: FastifyInstance) {
  // app.addHook("onRequest", verifyJWT);

  app.post("/order/create", { onRequest: [verifyJWT] }, create);
  app.post("/order/payment-success", paymentSuccess);
}
