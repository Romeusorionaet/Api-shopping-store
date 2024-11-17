import { FastifyRequest, FastifyReply } from "fastify";
import { makeRetrieveCategorySummariesUseCase } from "src/domain/store/application/use-cases/category/factory/make-retrieve-category-summaries-use-case";

export async function getRetrieveCategorySummaries(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const retrieveCategorySummariesUseCase =
    makeRetrieveCategorySummariesUseCase();

  const result = await retrieveCategorySummariesUseCase.execute();

  if (!result.value || result.value.categorySummaries.length === 0) {
    return reply.status(200).send({
      message: "No categories found.",
      categories: [],
    });
  }

  return reply.status(200).send({
    RetrieveCategorySummaries: result.value.categorySummaries,
  });
}
