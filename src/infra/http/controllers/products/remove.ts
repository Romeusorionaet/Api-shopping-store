import { FastifyRequest, FastifyReply } from "fastify";
import { ProductNotFoundError } from "src/domain/store/application/use-cases/errors/product-not-found-error";
import { makeRemoveProductUseCase } from "src/domain/store/application/use-cases/product/factory/make-remove-product-use-case";
import { z } from "zod";

const removeProductParamsSchema = z.object({
  productId: z.string().uuid(),
});

export async function remove(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { productId } = removeProductParamsSchema.parse(request.params);

    const removeProductUseCase = makeRemoveProductUseCase();

    const result = await removeProductUseCase.execute({ id: productId });

    if (result.isLeft()) {
      const err = result.value;
      switch (err.constructor) {
        case ProductNotFoundError:
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
