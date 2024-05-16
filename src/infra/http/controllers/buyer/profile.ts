import { FastifyRequest, FastifyReply } from "fastify";
import { ResourceNotFoundError } from "src/core/errors/resource-not-found-error";
import { BuyerPresenter } from "../../presenters/buyer-presenter";
import { makeGetBuyerProfileUseCase } from "src/domain/store/application/use-cases/buyer/factory/make-get-buyer-profile-use-case";
import { z } from "zod";

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const getProfileSchema = z.object({
    sub: z.string().uuid(),
  });

  console.log("====passou aqui");
  console.log(request.user);

  const { sub: id } = getProfileSchema.parse(request.user);

  const getBuyerProfileUseCase = makeGetBuyerProfileUseCase();

  const result = await getBuyerProfileUseCase.execute({
    buyerId: id,
  });

  if (result.isLeft()) {
    const err = result.value;
    switch (err.constructor) {
      case ResourceNotFoundError:
        return reply.status(400).send({
          error: err.message,
        });

      default:
        throw new Error(err.message);
    }
  }

  return reply
    .status(200)
    .send({ profile: BuyerPresenter.toHTTP(result.value.buyer) });
}
