import { FastifyRequest, FastifyReply } from "fastify";
import { CategoryAlreadyExistsError } from "src/domain/store/application/use-cases/errors/category-already-exists-error";
import { CategoryPresenter } from "../../presenters/category-presenter";
import { z } from "zod";
import { makeGetCategoryDetailsUseCase } from "src/domain/store/application/use-cases/factories/make-get-category-details-use-case";

export async function details(request: FastifyRequest, reply: FastifyReply) {
  const getCategoryDetailsParamsSchema = z.object({
    categoryId: z.string().uuid(),
  });

  const { categoryId } = getCategoryDetailsParamsSchema.parse(request.params);

  const getCategoryDetailsUseCase = makeGetCategoryDetailsUseCase();

  const result = await getCategoryDetailsUseCase.execute({ id: categoryId });

  if (result.isLeft()) {
    const err: CategoryAlreadyExistsError = result.value;

    return reply.status(400).send({ error: err.message });
  }

  return reply
    .status(200)
    .send(CategoryPresenter.toHTTP(result.value.category));
}
