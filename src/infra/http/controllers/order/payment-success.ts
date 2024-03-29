import { FastifyRequest, FastifyReply } from "fastify";

export async function paymentSuccess(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const headersRequest = request.headers as { [key: string]: string };
  const signature = headersRequest["x-hookdeck-signature"];

  if (!signature) {
    throw new Error("Error in signature.");
  }

  const result = request.body; // poder ser que tenha await antes

  console.log(result, "=====result");

  //   const headers = {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${env.MERCADOPAGO_ACCESS_TOKEN}`,
  //   };

  //   const response = await fetch(
  //     `https://api.mercadopago.com/v1/payments/${result.body.id}`,
  //     {
  //       headers,
  //     },
  //   );

  //   if (response.statusText === "approved") {
  //     const orderId = response.body;

  //     console.log("====", orderId);

  //     if (!orderId) {
  //       console.log("sem orderId");
  //       return;
  //     }

  //     const order = await prisma.order.update({
  //       where: {
  //         id: orderId,
  //       },
  //       include: {
  //         orderProducts: true,
  //       },
  //       data: {
  //         status: OrderStatus.PAYMENT_CONFIRMED,
  //       },
  //     })
  //   }

  return reply.status(201).send();
}
