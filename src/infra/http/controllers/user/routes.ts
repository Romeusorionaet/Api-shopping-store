import { FastifyInstance } from "fastify";
import { createUserAddress } from "./create-user-address";
import { getUserAddress } from "./get-user-address";
import { verifyJWTAccessToken } from "../../middlewares/verify-jwt-access-token";
import { updateUserAddress } from "./update-user-address";

export async function userRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWTAccessToken);

  app.put("/user/update-user-address", updateUserAddress);
  app.post("/user/create-address", createUserAddress);
  app.get("/user/get-address", getUserAddress);
}
