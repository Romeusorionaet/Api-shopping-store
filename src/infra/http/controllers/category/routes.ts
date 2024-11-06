import { FastifyInstance } from "fastify";
import { create } from "./create";
import { details } from "./details";
import { fetchCategories } from "./fetch-categories";
import { update } from "./update";
import { remove } from "./remove-category";

export async function categoriesRoutes(app: FastifyInstance) {
  app.post("/category/create", create);
  app.get("/category/details/:categoryId", details);
  app.get("/categories", fetchCategories);
  app.put("/category/update", update);
  app.delete("/category/remove/:categoryId", remove);
}
