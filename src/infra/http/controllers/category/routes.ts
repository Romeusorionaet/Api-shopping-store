import { FastifyInstance } from "fastify";
import { create } from "./create";
import { details } from "./details";
import { fetchCategories } from "./fetch-categories";
import { update } from "./update";
import { remove } from "./remove-category";
import { fetchCategoriesBasicData } from "./fetch-categories-basic-data";
import { verifyJWTAccessToken } from "../../middlewares/verify-jwt-access-token";
import { getCategoryTechnicalDetails } from "./get-category-technical-details";

export async function categoriesRoutes(app: FastifyInstance) {
  app.post(
    "/category/create",
    {
      preHandler: verifyJWTAccessToken(["write"]),
    },
    create,
  );
  app.get("/category/details/:categoryId", details);
  app.get("/categories", fetchCategories);
  app.put(
    "/category/update",
    {
      preHandler: verifyJWTAccessToken(["write"]),
    },
    update,
  );
  app.delete("/category/remove/:categoryId", remove);
  app.get("/categories/basic-data", fetchCategoriesBasicData);
  app.get(
    "/category/technical-details/:categoryId",
    {
      preHandler: verifyJWTAccessToken(["restricted_read"]),
    },
    getCategoryTechnicalDetails,
  );
}
