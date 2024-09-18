import { InsufficientProductInventoryError } from "src/domain/store/application/use-cases/errors/insufficient-product-Inventory.error";
import { makePurchaseOrderUseCase } from "src/domain/store/application/use-cases/order/factory/make-purchase-order-use-case";
import { OrderWithEmptyAddressError } from "src/domain/store/application/use-cases/errors/order-with-empty-address-error";
import { ProductIsOutOfStockError } from "src/domain/store/application/use-cases/errors/product-is-out-of-stock-error";
import { ProductNotFoundError } from "src/domain/store/application/use-cases/errors/product-not-found-error";
import { stripeCheckoutSession } from "src/infra/gateway-payment/stripe/stripe-checkout-session";
import { UserNotFoundError } from "src/core/errors/user-not-found-error";
import { orderSchema } from "../../schemas/order-schema";
import { FastifyRequest, FastifyReply } from "fastify";
import { subSchema } from "../../schemas/sub-schema";
import { z } from "zod";
import { NotificationFormatter } from "src/infra/web-sockets/formatter/notification-formatter";
import { makeNotificationProcess } from "../../helpers/make-notification-process";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  if (request.method !== "POST") {
    return reply.status(405).send({ error: "Method not allowed" });
  }

  try {
    const { orderProducts } = orderSchema.parse(request.body);

    const { sub: buyerId, publicId } = subSchema.parse(request.user);

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

    const listOrderTitles = orderProducts.map((order) => order.title);

    const formattedNotification =
      NotificationFormatter.notifyPaymentPending(listOrderTitles);

    await makeNotificationProcess({
      publicId,
      buyerId,
      formattedNotification,
    });

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
        error_path: err.errors[0].path,
      });
    } else {
      return reply
        .status(400)
        .send({ message: "Problem with checkout session." });
    }
  }
}
