import { FastifyRequest, FastifyReply } from "fastify";
import { UserNotFoundError } from "src/core/errors/user-not-found-error";
import { makeGetBuyerAddressUseCase } from "src/domain/store/application/use-cases/factories/make-get-buyer-address-use-case";
import { BuyerAddressPresenter } from "../../presenters/buyer-address";
import { z } from "zod";

export async function getBuyerAddress(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getBuyerAddressParamsSchema = z.object({
    addressId: z.string().uuid(),
  });

  const { addressId } = getBuyerAddressParamsSchema.parse(request.params);

  const getBuyerAddressUseCase = makeGetBuyerAddressUseCase();

  const result = await getBuyerAddressUseCase.execute({ addressId });

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
    buyerAddress: BuyerAddressPresenter.toHTTP(result.value.buyerAddress),
  });
}
