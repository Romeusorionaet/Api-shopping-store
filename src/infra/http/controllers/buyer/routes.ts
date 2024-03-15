import { FastifyInstance } from "fastify";
import { profile } from "./profile";
import { verifyJWT } from "../../middlewares/verify-jwt";
import { createBuyerAddress } from "./create-buyer-address";
import { updateBuyerAddress } from "./update-buyer-address";

export async function buyerRoutes(app: FastifyInstance) {
  app.get("/buyer/profile", { onRequest: [verifyJWT] }, profile);
  app.post("/buyer/create-buyer-address", createBuyerAddress);
  app.put("/buyer/update-buyer-address", updateBuyerAddress);
}
