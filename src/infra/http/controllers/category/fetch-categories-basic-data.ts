import { FastifyRequest, FastifyReply } from "fastify";
import { makeFetchCategoriesUseCase } from "src/domain/store/application/use-cases/category/factory/make-fetch-categories-use-case";

export async function fetchCategoriesBasicData(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchCategoriesUseCase = makeFetchCategoriesUseCase();

  const result = await fetchCategoriesUseCase.execute({});

  if (!result.value || result.value.categories.length === 0) {
    return reply.status(200).send({
      message: "No categories found.",
      categoriesBasicData: [],
    });
  }

  return reply.status(200).send({
    categoriesBasicData: result.value.categories,
  });
}
