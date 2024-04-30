import { FastifyRequest, FastifyReply } from "fastify";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { UserNotFoundError } from "src/core/errors/user-not-found-error";
import { OrderWithEmptyAddressError } from "src/domain/store/application/use-cases/errors/order-with-empty-address-error";
import { makePurchaseOrderUseCase } from "src/domain/store/application/use-cases/order/factory/make-purchase-order-use-case";
import { initializeStripe } from "src/infra/service/setup-stripe/stripe";
import { z } from "zod";

interface OrderProductProps {
  productId: UniqueEntityID;
  title: string;
  description: string;
  basePrice: number;
  discountPercentage: number;
  quantity: number;
}

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
  // preciso refatorar

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

  const successUrl = `https://google.com/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `https://facebook.com/`;

  try {
    const stripe = initializeStripe();

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        orderId,
      },

      line_items: orderProducts.map((product: OrderProductProps) => {
        const totalDiscount =
          Number(product.basePrice) * (product.discountPercentage / 100);
        const totalPrice = Number(product.basePrice) - totalDiscount;
        const totalPriceInCents = Math.round(totalPrice * 100);

        return {
          price_data: {
            currency: "brl",
            product_data: {
              name: product.title,
              description: product.description,
            },
            unit_amount: totalPriceInCents,
          },
          quantity: product.quantity,
        };
      }),
    });

    const successUrlWithSessionId = successUrl.replace(
      "{CHECKOUT_SESSION_ID}",
      checkoutSession.id,
    );

    return reply.status(201).send({
      checkoutUrl: checkoutSession.url,
      successUrlWithSessionId,
    });
  } catch (err) {
    return reply.status(401).send({
      error: err,
    });
  }
}
