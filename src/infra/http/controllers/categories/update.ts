import { FastifyRequest, FastifyReply } from "fastify";
import { ResourceNotFoundError } from "src/core/errors/resource-not-found-error";
import { makeUpdateCategoryUseCase } from "src/domain/store/application/use-cases/factories/make-update-category-use-case";
import { z } from "zod";

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const updateCategoryDetailsParamsSchema = z.object({
    id: z.string().uuid(),
    title: z.string(),
    imgUrl: z.string(),
  });

  const { id, imgUrl, title } = updateCategoryDetailsParamsSchema.parse(
    request.body,
  );

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
}
