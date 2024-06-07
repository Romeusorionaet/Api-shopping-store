import { FastifyRequest, FastifyReply } from "fastify";
import { makeCreateCategoryUseCase } from "src/domain/store/application/use-cases/category/factory/make-create-category-use-case";
import { CategoryAlreadyExistsError } from "src/domain/store/application/use-cases/errors/category-already-exists-error";
import { z } from "zod";
import { categoryCreateSchema } from "../../schemas/category-schema";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  try {
    const categoryData = categoryCreateSchema.parse(request.body);

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
  } catch (err) {
    if (err instanceof z.ZodError) {
      return reply.status(400).send({
        error: err.errors[0].message,
      });
    }
  }
}
