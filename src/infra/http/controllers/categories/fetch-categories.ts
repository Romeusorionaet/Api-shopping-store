import { FastifyRequest, FastifyReply } from "fastify";
import { CategoryPresenter } from "../../presenters/category-presenter";
import { makeFetchCategoriesUseCase } from "src/domain/store/application/use-cases/factories/make-fetch-categories-use-case";
import { z } from "zod";

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

  if (!result.value) {
    return reply.status(200).send([]);
  }

  return reply
    .status(200)
    .send(result.value.categories.map(CategoryPresenter.toHTTP));
}
