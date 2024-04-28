import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "src/infra/database/prisma/prisma";
import { env } from "src/infra/env";
import { initializeStripe } from "src/infra/service/setup-stripe/stripe";

const stripe = initializeStripe();

export async function webhook(request: FastifyRequest, reply: FastifyReply) {
  const signature = request.headers?.["stripe-signature"];
  if (!signature) {
    return reply.status(401).send({ message: "Invalid signature." });
  }

  if (!request.rawBody) {
    return reply.status(400).send({ message: "Missing request body." });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      request.rawBody,
      signature,
      env.STRIPE_WEBHOOK_SECRET_KEY,
      400,
    );
  } catch (err) {
    return reply
      .status(400)
      .send({ message: "⚠️  Webhook signature verification failed." });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;

      await stripe.checkout.sessions.retrieve(event.data.object.id, {
        expand: ["line_items"],
      });

      const order = await prisma.order.update({
        where: {
          id: session.metadata.orderId,
        },
        include: {
          orderProducts: true,
        },
        data: {
          status: "PAYMENT_CONFIRMED",
        },
      });

      const listOfQuantityOfProductsSold = order.orderProducts;

      for (const productSold of listOfQuantityOfProductsSold) {
        const productId = productSold.productId;
        const quantitySold = productSold.quantity;

        await prisma.product.update({
          where: {
            id: productId,
          },
          data: {
            stockQuantity: {
              decrement: quantitySold,
            },
          },
        });
      }
    }
  } catch (err) {
    console.log(err);
  }

  reply.status(200);
}
