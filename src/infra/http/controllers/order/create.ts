import { FastifyRequest, FastifyReply } from "fastify";
import { OrderWithEmptyAddressError } from "src/domain/store/application/use-cases/errors/order-with-empty-address-error";
import { makeCreateOrderUseCase } from "src/domain/store/application/use-cases/factories/make-order-use-case";
import { z } from "zod";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createOrderBodySchema = z.object({
    buyerId: z.string().uuid(),
    addressId: z.string().uuid(),
    orderProducts: z.any(),
  });

  const { buyerId, addressId, orderProducts } = createOrderBodySchema.parse(
    request.body,
  );

  const createOrderUseCase = makeCreateOrderUseCase();

  const result = await createOrderUseCase.execute({
    buyerId,
    addressId,
    orderProducts,
  });

  if (result.isLeft()) {
    const err = result.value;
    switch (err.constructor) {
      case OrderWithEmptyAddressError:
        return reply.status(400).send({
          error: err.message,
        });
      default:
        throw new Error(err.message);
    }
  }

  return reply.status(201).send();
}
