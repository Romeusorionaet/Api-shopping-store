import { FastifyInstance } from "fastify";
import { createUserAddress } from "./create-user-address";
import { getUserAddress } from "./get-user-address";
import { verifyJWTAccessToken } from "../../middlewares/verify-jwt-access-token";

export async function userRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWTAccessToken);

  app.post("/user/create-address", createUserAddress);
  app.get("/user/get-address", getUserAddress);
}
