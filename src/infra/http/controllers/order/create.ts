import { FastifyRequest, FastifyReply } from "fastify";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { UserNotFoundError } from "src/core/errors/user-not-found-error";
import { InsufficientProductInventoryError } from "src/domain/store/application/use-cases/errors/insufficient-product-Inventory.error";
import { OrderWithEmptyAddressError } from "src/domain/store/application/use-cases/errors/order-with-empty-address-error";
import { ProductIsOutOfStockError } from "src/domain/store/application/use-cases/errors/product-is-out-of-stock-error";
import { ProductNotFoundError } from "src/domain/store/application/use-cases/errors/product-not-found-error";
import { makePurchaseOrderUseCase } from "src/domain/store/application/use-cases/order/factory/make-purchase-order-use-case";
import { stripeCheckoutSession } from "src/infra/service/setup-stripe/stripe-checkout-session";
import { z } from "zod";

const uuidType = z.string().refine((value) => {
  return value;
});

const createOrderBodySchema = z.object({
  orderProducts: z.array(
    z.object({
      productId: uuidType.transform((value) => new UniqueEntityID(value)),
      imgUrl: z.string(),
      title: z
        .string()
        .min(1, { message: "É preciso informar o título do produto." }),
      description: z.string(),
      basePrice: z.coerce.number(),
      discountPercentage: z.coerce.number(),
      quantity: z.coerce.number(),
      colorList: z.array(z.string()),
    }),
  ),
});

const buyerSchema = z.object({
  sub: z.string().uuid(),
});

export async function create(request: FastifyRequest, reply: FastifyReply) {
  if (request.method !== "POST") {
    return reply.status(405).send({ error: "Method not allowed" });
  }

  const { orderProducts } = createOrderBodySchema.parse(request.body);
  const { sub: buyerId } = buyerSchema.parse(request.user);

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
    return reply
      .status(400)
      .send({ message: "Problem with checkout session." });
  }
}
