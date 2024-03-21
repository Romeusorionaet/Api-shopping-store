import { FastifyRequest, FastifyReply } from "fastify";
import { CategoryPresenter } from "../../presenters/category-presenter";
import { makeGetCategoryDetailsUseCase } from "src/domain/store/application/use-cases/factories/make-get-category-details-use-case";
import { ResourceNotFoundError } from "src/core/errors/resource-not-found-error";
import { z } from "zod";

export async function details(request: FastifyRequest, reply: FastifyReply) {
  const getCategoryDetailsParamsSchema = z.object({
    categoryId: z.string().uuid(),
  });

  const { categoryId } = getCategoryDetailsParamsSchema.parse(request.params);

  const getCategoryDetailsUseCase = makeGetCategoryDetailsUseCase();

  const result = await getCategoryDetailsUseCase.execute({ id: categoryId });

  if (result.isLeft()) {
    const err = result.value;
    switch (err.constructor) {
      case ResourceNotFoundError:
        return reply.status(400).send({
          error: err.message,
        });

      default:
        throw new Error(err.message);
    }
  }

  return reply
    .status(200)
    .send({ category: CategoryPresenter.toHTTP(result.value.category) });
}
