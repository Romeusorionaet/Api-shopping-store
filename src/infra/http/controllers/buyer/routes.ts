import { FastifyInstance } from "fastify";
import { profile } from "./profile";
import { createBuyerAddress } from "./create-buyer-address";
import { updateBuyerAddress } from "./update-buyer-address";
import { getBuyerAddress } from "./get-buyer-address";
import { verifyJWT } from "../../middlewares/verify-jwt";

export async function buyerRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.get("/buyer/profile", profile);
  app.post("/buyer/create-buyer-address", createBuyerAddress);
  app.put("/buyer/update-buyer-address", updateBuyerAddress);
  app.get("/buyer/buyer-address/:buyerId", getBuyerAddress);
}
