import { FastifyInstance } from "fastify";
import { profile } from "./profile";
import { updateBuyerAddress } from "./update-buyer-address";
import { getBuyerAddress } from "./get-buyer-address";
import { getBuyerOrders } from "./get-buyer-orders";
import { verifyJWTAccessToken } from "../../middlewares/verify-jwt-access-token";

export async function buyerRoutes(app: FastifyInstance) {
  // app.addHook("onRequest", verifyJWTAccessToken);

  app.get("/buyer/profile", profile);
  app.put("/buyer/update-buyer-address", updateBuyerAddress);
  app.get("/buyer/address/:buyerId", getBuyerAddress);
  app.get("/buyer/orders/:buyerId", getBuyerOrders);
}
