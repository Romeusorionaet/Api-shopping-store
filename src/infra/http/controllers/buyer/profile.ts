import { FastifyRequest, FastifyReply } from "fastify";
import { ResourceNotFoundError } from "src/core/errors/resource-not-found-error";
import { BuyerPresenter } from "../../presenters/buyer-presenter";
import { makeGetBuyerProfileUseCase } from "src/domain/store/application/use-cases/buyer/factory/make-get-buyer-profile-use-case";
import { subSchema } from "../../schemas/sub-schema";
import { z } from "zod";

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { sub: id } = subSchema.parse(request.user);

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
  } catch (err) {
    if (err instanceof z.ZodError) {
      return reply.status(400).send({
        error: err.errors[0].message,
        error_path: err.errors[0].path,
      });
    }
  }
}
