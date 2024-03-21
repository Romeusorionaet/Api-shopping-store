import { FastifyRequest, FastifyReply } from "fastify";
import { CategoryAlreadyExistsError } from "src/domain/store/application/use-cases/errors/category-already-exists-error";
import { makeCreateCategoryUseCase } from "src/domain/store/application/use-cases/factories/make-create-category-use-case";
import { z } from "zod";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createCategoryBodySchema = z.object({
    title: z.string(),
    imgUrl: z.string(),
  });

  const categoryData = createCategoryBodySchema.parse(request.body);

  const createCategoryUseCase = makeCreateCategoryUseCase();

  const result = await createCategoryUseCase.execute(categoryData);

  if (result.isLeft()) {
    const err = result.value;
    switch (err.constructor) {
      case CategoryAlreadyExistsError:
        return reply.status(400).send({
          error: err.message,
        });

      default:
        throw new Error(err.message);
    }
  }

  return reply.status(201).send();
}
