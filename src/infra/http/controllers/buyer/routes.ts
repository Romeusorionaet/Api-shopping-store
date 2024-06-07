import { FastifyInstance } from "fastify";
import { profile } from "./profile";
import { getBuyerAddress } from "./get-buyer-address";
import { getBuyerOrders } from "./get-buyer-orders";
import { verifyJWTAccessToken } from "../../middlewares/verify-jwt-access-token";
import { getBuyerOrderProduct } from "./get-buyer-order-product";

export async function buyerRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWTAccessToken);

  app.get("/buyer/profile", profile);
  app.get("/buyer/address", getBuyerAddress);
  app.get("/buyer/orders", getBuyerOrders);
  app.get("/buyer/order/products", getBuyerOrderProduct);
}
