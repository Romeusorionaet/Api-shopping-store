import { FastifyInstance } from "fastify";
import { profile } from "./profile";
import { verifyJWT } from "../../middlewares/verify-jwt";
import { createBuyerAddress } from "./create-buyer-address";

export async function buyerRoutes(app: FastifyInstance) {
  app.get("/buyer/profile", { onRequest: [verifyJWT] }, profile);
  app.post("/buyer/create-buyer-address", createBuyerAddress);
}
