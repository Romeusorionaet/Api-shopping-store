import { FastifyInstance } from "fastify";
import { createUserAddress } from "./create-user-address";
import { getUserAddress } from "./get-user-address";
import { verifyJWTAccessToken } from "../../middlewares/verify-jwt-access-token";
import { updateUserAddress } from "./update-user-address";

export async function userRoutes(app: FastifyInstance) {
  app.register(async (subApp) => {
    subApp.addHook("preHandler", verifyJWTAccessToken(["read"]));
    subApp.put("/user/update-user-address", updateUserAddress);
    subApp.post("/user/create-address", createUserAddress);
    subApp.get("/user/get-address", getUserAddress);
  });
}
