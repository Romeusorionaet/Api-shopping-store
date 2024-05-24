import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeGetBuyerOrderProductUseCase } from "src/domain/store/application/use-cases/buyer/factory/make-get-buyer-order-product-use-case";
import { NoProductsOrderedByBuyerError } from "src/domain/store/application/use-cases/errors/no-products-ordered-by-buyer-error";
import { ProductPresenter } from "../../presenters/product-presenter";

export async function getBuyerOrderProduct(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getBuyerOrderProductUserSchema = z.object({
    sub: z.string().uuid(),
  });

  const getBuyerOrderProductQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  });

  const { page } = getBuyerOrderProductQuerySchema.parse(request.query);

  const { sub: buyerId } = getBuyerOrderProductUserSchema.parse(request.user);

  const getBuyerOrderProductUseCase = makeGetBuyerOrderProductUseCase();

  const result = await getBuyerOrderProductUseCase.execute({ buyerId, page });

  if (result.isLeft()) {
    const err = result.value;
    switch (err.constructor) {
      case NoProductsOrderedByBuyerError:
        return reply.status(400).send({
          error: err.message,
        });
      default:
        throw new Error(err.message);
    }
  }

  return reply.status(200).send({
    products: result.value.products.map(ProductPresenter.toHTTP),
  });
}
