import { FastifyRequest, FastifyReply } from "fastify";
import { makeGetBuyerOrdersUseCase } from "src/domain/store/application/use-cases/buyer/factory/make-get-buyer-order-use-case";
import { BuyerOrderPresenter } from "../../presenters/buyer-order-presenter";
import { subSchema } from "../../schemas/sub-schema";
import { z } from "zod";

export async function fetchBuyerOrders(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { sub: buyerId } = subSchema.parse(request.user);

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
  } catch (err) {
    if (err instanceof z.ZodError) {
      return reply.status(400).send({
        error: err.errors[0].message,
        error_path: err.errors[0].path,
      });
    }
  }
}
