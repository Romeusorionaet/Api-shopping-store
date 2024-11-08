import { FastifyRequest, FastifyReply } from "fastify";
import { CategoryPresenter } from "../../presenters/category-presenter";
import { z } from "zod";
import { makeFetchCategoriesUseCase } from "src/domain/store/application/use-cases/category/factory/make-fetch-categories-use-case";
import { Category } from "src/domain/store/enterprise/entities/category";

const fetchCategoriesSchema = z.object({
  page: z.coerce.number().min(1).default(1),
});

export async function fetchCategories(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { page } = fetchCategoriesSchema.parse(request.query);

  const fetchCategoriesUseCase = makeFetchCategoriesUseCase();

  const result = await fetchCategoriesUseCase.execute({ page });

  if (!result.value || result.value.categories.length === 0) {
    return reply.status(200).send({
      message: "No categories found.",
      categories: [],
    });
  }

  return reply.status(200).send({
    categories:
      Array.isArray(result.value.categories) &&
      "slug" in result.value.categories[0]
        ? result.value.categories.map((category) =>
            CategoryPresenter.toHTTP(category as Category),
          )
        : result.value.categories,
  });
}
