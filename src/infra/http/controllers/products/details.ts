import { FastifyRequest, FastifyReply } from "fastify";
import { ProductPresenter } from "../../presenters/product-presenter";
import { z } from "zod";
import { makeGetProductDetailsUseCase } from "src/domain/store/application/use-cases/product/factory/make-get-product-details-use-case";
import { ProductNotFoundError } from "src/domain/store/application/use-cases/errors/product-not-found-error";

export async function details(request: FastifyRequest, reply: FastifyReply) {
  const getProductDetailsParamsSchema = z.object({
    productId: z.string().uuid(),
  });

  const { productId } = getProductDetailsParamsSchema.parse(request.params);

  const getProductDetailsUseCase = makeGetProductDetailsUseCase();

  const result = await getProductDetailsUseCase.execute({ productId });

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

  return reply
    .status(200)
    .send({ product: ProductPresenter.toHTTP(result.value.product) });
}
