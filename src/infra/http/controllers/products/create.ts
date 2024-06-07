import { FastifyRequest, FastifyReply } from "fastify";
import { CategoryTitleSentDoesNotMatchError } from "src/domain/store/application/use-cases/errors/category-title-sent-does-not-match-error";
import { ProductAlreadyExistsError } from "src/domain/store/application/use-cases/errors/product-already-exists-error";
import { TheAssignedCategoryDoesNotExistError } from "src/domain/store/application/use-cases/errors/the-assigned-category-does-not-exist-error";
import { makeCreateProductUseCase } from "src/domain/store/application/use-cases/product/factory/make-create-product-use-case";
import { productCreateSchema } from "../../schemas/product-schema";
import { z } from "zod";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  try {
    const productData = productCreateSchema.parse(request.body);

    const createProductUseCase = makeCreateProductUseCase();

    const result = await createProductUseCase.execute(productData);

    if (result.isLeft()) {
      const err = result.value;
      switch (err.constructor) {
        case ProductAlreadyExistsError:
        case CategoryTitleSentDoesNotMatchError:
        case TheAssignedCategoryDoesNotExistError:
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
