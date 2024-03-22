import { FastifyRequest, FastifyReply } from "fastify";
import { CategoryPresenter } from "../../presenters/category-presenter";
import { z } from "zod";
import { makeFetchCategoriesUseCase } from "src/domain/store/application/use-cases/category/factory/make-fetch-categories-use-case";

export async function fetchCategories(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchCategoriesSchema = z.object({
    page: z.coerce.number().min(1).default(1),
  });

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
    categories: result.value.categories.map(CategoryPresenter.toHTTP),
  });
}
