import { FastifyInstance } from "fastify";
import { create } from "./create";
import { search } from "./search";

export async function productsRoutes(app: FastifyInstance) {
  app.post("/product", create);
  app.get("/products/search", search);
}
