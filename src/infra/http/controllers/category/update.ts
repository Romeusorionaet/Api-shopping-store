import { FastifyRequest, FastifyReply } from "fastify";
import { ResourceNotFoundError } from "src/core/errors/resource-not-found-error";
import { makeUpdateCategoryUseCase } from "src/domain/store/application/use-cases/category/factory/make-update-category-use-case";
import { z } from "zod";
import { categoryUpdateSchema } from "../../schemas/category-schema";

export async function update(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id, imgUrl, title } = categoryUpdateSchema.parse(request.body);

    const updateCategoryUseCase = makeUpdateCategoryUseCase();

    const result = await updateCategoryUseCase.execute({
      id,
      imgUrl,
      title,
    });

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
