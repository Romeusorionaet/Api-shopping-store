import { FastifyInstance } from "fastify";
import { createUserAddress } from "./create-user-address";
import { getUserAddress } from "./get-user-address";

export async function userRoutes(app: FastifyInstance) {
  app.post("/user/create-address", createUserAddress);
  app.get("/user/get-address/:userId", getUserAddress);
}
