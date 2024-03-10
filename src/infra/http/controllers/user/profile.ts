import { FastifyRequest, FastifyReply } from "fastify";
import { ResourceNotFoundError } from "src/core/errors/resource-not-found-error";
import { makeGetBuyerProfileUseCase } from "src/domain/store/application/use-cases/factories/make-get-buyer-profile";

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const getBuyerProfileUseCase = makeGetBuyerProfileUseCase();

  const result = await getBuyerProfileUseCase.execute({
    buyerId: request.user.sub,
  });

  if (result.isLeft()) {
    const err: ResourceNotFoundError = result.value;

    return reply.status(400).send({ error: err.message });
  }

  // parei aqui onde vou retoranr o presenter
  return reply.status(200).send(result.value.buyer);
}
