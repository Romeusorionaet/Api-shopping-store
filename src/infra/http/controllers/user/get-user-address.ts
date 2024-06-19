import { FastifyRequest, FastifyReply } from "fastify";
import { makeGetUserAddressUseCase } from "src/domain/store/application/use-cases/user/factory/make-get-user-address";
import { AddressNotFoundError } from "src/domain/store/application/use-cases/errors/address-not-found-error";
import { UserAddressPresenter } from "../../presenters/user-address-presenter";
import { subSchema } from "../../schemas/sub-schema";
import { z } from "zod";

export async function getUserAddress(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { sub: userId } = subSchema.parse(request.user);

    const getUserAddressUseCase = makeGetUserAddressUseCase();

    const result = await getUserAddressUseCase.execute({ userId });

    if (result.isLeft()) {
      const err = result.value;
      switch (err.constructor) {
        case AddressNotFoundError:
          return reply.status(400).send({
            error: err.message,
          });
        default:
          throw new Error(err.message);
      }
    }

    return reply.status(200).send({
      userAddress: UserAddressPresenter.toHTTP(result.value.userAddress),
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
