import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeGetBuyerOrdersUseCase } from "src/domain/store/application/use-cases/buyer/factory/make-get-buyer-order-use-case";
import { BuyerOrderPresenter } from "../../presenters/buyer-order-presenter";

export async function getBuyerOrders(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getBuyerOrdersParamsSchema = z.object({
    sub: z.string().uuid(),
  });

  const { sub: buyerId } = getBuyerOrdersParamsSchema.parse(request.user);

  const getBuyerOrdersUseCase = makeGetBuyerOrdersUseCase();

  const result = await getBuyerOrdersUseCase.execute({ buyerId });

  if (!result.value || result.value.orders.length === 0) {
    return reply.status(200).send({
      message: "No orders found.",
      orders: [],
    });
  }

  return reply.status(200).send({
    orders: result.value.orders.map(BuyerOrderPresenter.toHTTP),
  });
}
