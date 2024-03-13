import { FastifyInstance } from "fastify";
import { create } from "./create";
import { search } from "./search";
import { fetchProducts } from "./fetch-products";

export async function productsRoutes(app: FastifyInstance) {
  app.post("/product", create);
  app.get("/products/search", search);
  app.get("/products", fetchProducts);
}
