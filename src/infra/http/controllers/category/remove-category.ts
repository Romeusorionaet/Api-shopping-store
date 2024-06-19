import { FastifyRequest, FastifyReply } from "fastify";
import { ResourceNotFoundError } from "src/core/errors/resource-not-found-error";
import { makeRemoveCategoryUseCase } from "src/domain/store/application/use-cases/category/factory/make-delete-category-use-case";
import { z } from "zod";

const removeCategoryParamsSchema = z.object({
  categoryId: z.string().uuid(),
});

export async function remove(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { categoryId } = removeCategoryParamsSchema.parse(request.params);

    const removeCategoryUseCase = makeRemoveCategoryUseCase();

    const result = await removeCategoryUseCase.execute({ id: categoryId });

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

    return reply.status(201).send();
  } catch (err) {
    if (err instanceof z.ZodError) {
      return reply.status(400).send({
        error: err.errors[0].message,
        error_path: err.errors[0].path,
      });
    }
  }
}
