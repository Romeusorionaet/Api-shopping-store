import { FastifyInstance } from "fastify";
import { create } from "./create";
import { details } from "./details";
import { fetchCategories } from "./fetch-categories";

export async function categoriesRoutes(app: FastifyInstance) {
  app.post("/category", create);
  app.get("/category/details/:categoryId", details);
  app.get("/categories", fetchCategories);
}
