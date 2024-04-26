import { FastifyRequest, FastifyReply } from "fastify";
import { UserNotFoundError } from "src/core/errors/user-not-found-error";
import { OrderWithEmptyAddressError } from "src/domain/store/application/use-cases/errors/order-with-empty-address-error";
import { makePurchaseOrderUseCase } from "src/domain/store/application/use-cases/order/factory/make-purchase-order-use-case";
import { stripe } from "src/infra/service/setup-stripe/stripe";
import { z } from "zod";

interface ProductsProps {
  id: string;
  name: string;
  imageUrl: string;
  price: string;
  defaultPriceId: string;
  quantity: number;
}

export async function create(request: FastifyRequest, reply: FastifyReply) {
  if (request.method !== "POST") {
    return reply.status(405).send({ error: "Method not allowed" });
  }

  const createOrderBodySchema = z.object({
    buyerId: z.string().uuid(),
    orderProducts: z.any(),
    // totalPrice: z.number(),
  });

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

  const successUrl = `https://google.com/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `https://facebook.com/`;

  const transformItems = orderProducts.map((item: ProductsProps) => ({
    price: item.defaultPriceId,
    quantity: item.quantity,
  }));

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      line_items: transformItems,
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
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
