import { FastifyRequest, FastifyReply } from "fastify";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { UserNotFoundError } from "src/core/errors/user-not-found-error";
import { OrderWithEmptyAddressError } from "src/domain/store/application/use-cases/errors/order-with-empty-address-error";
import { makePurchaseOrderUseCase } from "src/domain/store/application/use-cases/order/factory/make-purchase-order-use-case";
import { stripeCheckoutSession } from "src/infra/service/setup-stripe/stripe-checkout-session";
import { z } from "zod";

const uuidType = z.string().refine((value) => {
  return value;
});

const createOrderBodySchema = z.object({
  buyerId: z.string().uuid(),
  orderProducts: z.array(
    z.object({
      productId: uuidType.transform((value) => new UniqueEntityID(value)),
      title: z.string(),
      description: z.string(),
      basePrice: z.coerce.number(),
      discountPercentage: z.coerce.number(),
      quantity: z.coerce.number(),
      // adicionar o "color"
    }),
  ),
});

export async function create(request: FastifyRequest, reply: FastifyReply) {
  if (request.method !== "POST") {
    return reply.status(405).send({ error: "Method not allowed" });
  }

  const { buyerId, orderProducts } = createOrderBodySchema.parse(request.body);

  const createOrderUseCase = makePurchaseOrderUseCase();

  const result = await createOrderUseCase.execute({
    buyerId,
    orderProducts,
  });

  if (result.isLeft()) {
    const err = result.value;
    switch (err.constructor) {
      case OrderWithEmptyAddressError:
        return reply.status(400).send({
          error: err.message,
        });

      case UserNotFoundError:
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
