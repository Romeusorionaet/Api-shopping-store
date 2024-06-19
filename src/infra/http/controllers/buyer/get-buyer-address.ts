import { FastifyRequest, FastifyReply } from "fastify";
import { UserNotFoundError } from "src/core/errors/user-not-found-error";
import { makeGetBuyerAddressUseCase } from "src/domain/store/application/use-cases/buyer/factory/make-get-buyer-address-use-case";
import { BuyerAddressPresenter } from "../../presenters/buyer-address-presenter";
import { subSchema } from "../../schemas/sub-schema";
import { z } from "zod";

export async function getBuyerAddress(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { sub: buyerId } = subSchema.parse(request.user);

    const getBuyerAddressUseCase = makeGetBuyerAddressUseCase();

    const result = await getBuyerAddressUseCase.execute({ buyerId });

    if (result.isLeft()) {
      const err = result.value;
      switch (err.constructor) {
        case UserNotFoundError:
          return reply.status(400).send({
            error: err.message,
          });
        default:
          throw new Error(err.message);
      }
    }

    return reply.status(200).send({
      buyerAddress: result.value.buyerAddress.map(BuyerAddressPresenter.toHTTP),
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return reply.status(400).send({
        error: err.errors[0].message,
        error_path: err.errors[0].path,
      });
    }
  }
}
