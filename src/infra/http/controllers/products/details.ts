import { FastifyRequest, FastifyReply } from "fastify";
import { ProductPresenter } from "../../presenters/product-presenter";
import { ResourceNotFoundError } from "src/core/errors/resource-not-found-error";
import { z } from "zod";
import { makeGetProductDetailsUseCase } from "src/domain/store/application/use-cases/factories/make-get-product-details";

export async function details(request: FastifyRequest, reply: FastifyReply) {
  const getProductDetailsParamsSchema = z.object({
    productId: z.string().uuid(),
  });

  const { productId } = getProductDetailsParamsSchema.parse(request.params);

  const getProductDetailsUseCase = makeGetProductDetailsUseCase();

  const result = await getProductDetailsUseCase.execute({ productId });

  if (result.isLeft()) {
    const err: ResourceNotFoundError = result.value;

    return reply.status(400).send({ error: err.message });
  }

  return reply
    .status(200)
    .send({ product: ProductPresenter.toHTTP(result.value.product) });
}
