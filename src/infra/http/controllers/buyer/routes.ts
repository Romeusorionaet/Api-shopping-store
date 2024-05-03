import { FastifyInstance } from "fastify";
import { profile } from "./profile";
import { updateBuyerAddress } from "./update-buyer-address";
import { getBuyerAddress } from "./get-buyer-address";
import { verifyJWT } from "../../middlewares/verify-jwt";
import { getBuyerOrders } from "./get-buyer-orders";

export async function buyerRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.get("/buyer/profile", profile);
  app.put("/buyer/update-buyer-address", updateBuyerAddress);
  app.get("/buyer/address/:buyerId", getBuyerAddress);
  app.get("/buyer/orders/:buyerId", getBuyerOrders);
}
