import { FastifyRequest, FastifyReply } from "fastify";
import { OrderNotFoundError } from "src/domain/store/application/use-cases/errors/order-not-found-error";
import { makeConfirmOderPaymentUseCase } from "src/domain/store/application/use-cases/order/factory/make-confirm-order-payment-use-case";
import { initializeStripe } from "src/infra/service/setup-stripe/stripe";
import { stripeConstructorEventWebhook } from "src/infra/service/setup-stripe/stripe-constructor-event-webhook";

const stripe = initializeStripe();

export async function webhook(request: FastifyRequest, reply: FastifyReply) {
  const signature = request.headers?.["stripe-signature"];

  if (!signature) {
    return reply.status(401).send({ message: "Invalid signature." });
  }

  if (!request.rawBody) {
    return reply.status(400).send({ message: "Missing request body." });
  }

  let constructorEvent;

  try {
    const { event } = stripeConstructorEventWebhook({
      data: request.rawBody,
      signature,
    });

    constructorEvent = event;
  } catch (err) {
    return reply
      .status(400)
      .send({ message: "⚠️ Webhook signature verification failed." });
  }

  try {
    if (constructorEvent.type === "checkout.session.completed") {
      const session = constructorEvent.data.object as any;

      const retrievedSession = await stripe.checkout.sessions.retrieve(
        session.id,
        {
          expand: ["line_items"],
        },
      );

      const orderId = retrievedSession.metadata?.orderId;

      if (!orderId) {
        reply
          .status(401)
          .send({ message: "There was a problem with the checkout process." });
      }

      const confirmOrderPayment = makeConfirmOderPaymentUseCase();

      const result = await confirmOrderPayment.execute({
        orderId: session.metadata.orderId,
      });

      if (result.isLeft()) {
        reply.status(400).send({
          OrderNotFoundError,
        });
      }

      reply.status(200);
    }
  } catch (err) {
    reply
      .status(401)
      .send({ message: "There was a problem with the checkout process." });
  }
}
