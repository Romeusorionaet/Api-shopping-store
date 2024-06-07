import { FastifyRequest, FastifyReply } from "fastify";
import { UserNotFoundError } from "src/core/errors/user-not-found-error";
import { InsufficientProductInventoryError } from "src/domain/store/application/use-cases/errors/insufficient-product-Inventory.error";
import { OrderWithEmptyAddressError } from "src/domain/store/application/use-cases/errors/order-with-empty-address-error";
import { ProductIsOutOfStockError } from "src/domain/store/application/use-cases/errors/product-is-out-of-stock-error";
import { ProductNotFoundError } from "src/domain/store/application/use-cases/errors/product-not-found-error";
import { makePurchaseOrderUseCase } from "src/domain/store/application/use-cases/order/factory/make-purchase-order-use-case";
import { stripeCheckoutSession } from "src/infra/service/setup-stripe/stripe-checkout-session";
import { z } from "zod";
import { subSchema } from "../../schemas/sub-schema";
import { orderSchema } from "../../schemas/order-schema";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  if (request.method !== "POST") {
    return reply.status(405).send({ error: "Method not allowed" });
  }

  const { orderProducts } = orderSchema.parse(request.body);
  const { sub: buyerId } = subSchema.parse(request.user);

  const createOrderUseCase = makePurchaseOrderUseCase();

  const result = await createOrderUseCase.execute({
    buyerId,
    orderProducts,
  });

  if (result.isLeft()) {
    const err = result.value;
    switch (err.constructor) {
      case OrderWithEmptyAddressError:
      case UserNotFoundError:
      case ProductNotFoundError:
      case ProductIsOutOfStockError:
      case InsufficientProductInventoryError:
        return reply.status(400).send({
          error: err.message,
        });
      default:
        throw new Error(err.message);
    }
  }

  const orderId = result.value.order.id.toString();

  try {
    const { checkoutUrl, successUrlWithSessionId } =
      await stripeCheckoutSession({ orderId, orderProducts });

    return reply.status(201).send({
      checkoutUrl,
      successUrlWithSessionId,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return reply.status(400).send({
        error: err.errors[0].message,
      });
    } else {
      return reply
        .status(400)
        .send({ message: "Problem with checkout session." });
    }
  }
}
