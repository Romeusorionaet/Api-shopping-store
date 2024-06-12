import { FastifyRequest, FastifyReply } from "fastify";
import { OrderNotFoundError } from "src/domain/store/application/use-cases/errors/order-not-found-error";
import { makeConfirmOderPaymentUseCase } from "src/domain/store/application/use-cases/order/factory/make-confirm-order-payment-use-case";
import { StripeConstructorEventRepository } from "src/infra/gateway-payment/stripe/stripe-constructor-event-repository";
import { stripe } from "src/infra/service/setup-stripe/stripe";

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
    const stripeConstructorEvent = new StripeConstructorEventRepository();

    const event = stripeConstructorEvent.webhook({
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

      await stripe.checkout.sessions.retrieve(session.id, {
        expand: ["line_items"],
      });

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
