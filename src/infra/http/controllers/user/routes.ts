import { FastifyInstance } from "fastify";
import { authenticate } from "./authenticate";
import { register } from "./register";
import { createUserAddress } from "./create-user-address";
import { getUserAddress } from "./get-user-address";

export async function userRoutes(app: FastifyInstance) {
  app.post("/user/register", register);
  app.post("/user/authenticate", authenticate);
  app.post("/user/create-user-address", createUserAddress);
  app.get("/user/user-address/:userId", getUserAddress);
}
