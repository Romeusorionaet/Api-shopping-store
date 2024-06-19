import { FastifyRequest, FastifyReply } from "fastify";
import { makeGetBuyerOrderProductUseCase } from "src/domain/store/application/use-cases/buyer/factory/make-get-buyer-order-product-use-case";
import { OrderProductPresenter } from "../../presenters/order-product-presenter";
import { subSchema } from "../../schemas/sub-schema";
import { z } from "zod";

export async function getBuyerOrderProduct(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { sub: buyerId } = subSchema.parse(request.user);

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
  } catch (err) {
    if (err instanceof z.ZodError) {
      return reply.status(400).send({
        error: err.errors[0].message,
        error_path: err.errors[0].path,
      });
    }
  }
}
