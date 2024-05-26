import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeGetBuyerOrderProductUseCase } from "src/domain/store/application/use-cases/buyer/factory/make-get-buyer-order-product-use-case";
import { OrderProductPresenter } from "../../presenters/order-product-presenter";

export async function getBuyerOrderProduct(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getBuyerOrderProductUserSchema = z.object({
    sub: z.string().uuid(),
  });

  const { sub: buyerId } = getBuyerOrderProductUserSchema.parse(request.user);

  const getBuyerOrderProductUseCase = makeGetBuyerOrderProductUseCase();

  const result = await getBuyerOrderProductUseCase.execute({ buyerId });

  if (!result.value || result.value.orderProducts.length === 0) {
    return reply.status(200).send({
      message: "No order products found.",
      products: [],
    });
  }

  return reply.status(200).send({
    products: result.value.orderProducts.map(OrderProductPresenter.toHTTP),
  });
}
