import { FastifyRequest, FastifyReply } from "fastify";
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

  await createOrderUseCase.execute({
    buyerId,
    addressId,
    orderProducts,
  });

  return reply.status(201).send();
}
