import { FastifyRequest, FastifyReply } from "fastify";
import { UserNotFoundError } from "src/core/errors/user-not-found-error";
import { makeCreateUserAddressUseCase } from "src/domain/store/application/use-cases/user/factory/make-create-user-address-use-case";
import { AddressAlreadyExistError } from "src/domain/store/application/use-cases/errors/address-already-exist-error";
import { addressSchema } from "../../schemas/address-schema";
import { z } from "zod";
import { subSchema } from "../../schemas/sub-schema";

export async function createUserAddress(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const dataUserAddress = addressSchema.parse(request.body);
    const { sub: userId } = subSchema.parse(request.user);

    const addressWithUserId = { ...dataUserAddress, userId };

    const createUserAddressUseCase = makeCreateUserAddressUseCase();

    const result = await createUserAddressUseCase.execute(addressWithUserId);

    if (result.isLeft()) {
      const err = result.value;
      switch (err.constructor) {
        case UserNotFoundError:
        case AddressAlreadyExistError:
          return reply.status(400).send({
            error: err.message,
          });
        default:
          throw new Error(err.message);
      }
    }

    return reply.status(201).send({ message: "Endereço criado." });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return reply.status(400).send({
        error: err.errors[0].message,
      });
    }
  }
}
