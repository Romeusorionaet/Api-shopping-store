import { FastifyRequest, FastifyReply } from "fastify";
import { CategoryPresenter } from "../../presenters/category-presenter";
import { ResourceNotFoundError } from "src/core/errors/resource-not-found-error";
import { makeGetCategoryDetailsUseCase } from "src/domain/store/application/use-cases/category/factory/make-get-category-details-use-case";
import { z } from "zod";

const getCategoryDetailsParamsSchema = z.object({
  categoryId: z.string().uuid(),
});

export async function details(request: FastifyRequest, reply: FastifyReply) {
  try {
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
  } catch (err) {
    if (err instanceof z.ZodError) {
      return reply.status(400).send({
        error: err.errors[0].message,
        error_path: err.errors[0].path,
      });
    }
  }
}
