import { FastifyInstance } from "fastify";
import { create } from "./create";
import { search } from "./search";
import { fetchProducts } from "./fetch-products";
import { details } from "./details";
import { update } from "./update";
import { fetchProductsByCategory } from "./fetch-products-by-category";
import { remove } from "./remove";

export async function productsRoutes(app: FastifyInstance) {
  app.post("/product", create);
  app.get("/products/search", search);
  app.get("/products", fetchProducts);
  app.get("/products/same-category", fetchProductsByCategory);
  app.get("/product/details/:productId", details);
  app.put("/product/update", update);
  app.delete("/product/remove/:productId", remove);
}
