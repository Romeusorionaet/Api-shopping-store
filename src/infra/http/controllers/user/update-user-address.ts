import { FastifyRequest, FastifyReply } from "fastify";
import { AddressNotFoundError } from "src/domain/store/application/use-cases/errors/address-not-found-error";
import { makeUpdateUserAddressUseCase } from "src/domain/store/application/use-cases/user/factory/make-update-user-address-use-case";
import { addressSchema } from "../../schemas/address-schema";
import { z } from "zod";
import { subSchema } from "../../schemas/sub-schema";

export async function updateUserAddress(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const dataUserAddress = addressSchema.parse(request.body);
    const { sub: userId } = subSchema.parse(request.user);

    const dataUserAddressWithUserId = { ...dataUserAddress, userId };

    const updateUserAddressUseCase = makeUpdateUserAddressUseCase();

    const result = await updateUserAddressUseCase.execute(
      dataUserAddressWithUserId,
    );

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

    return reply.status(201).send({ message: "Endereço atualizado." });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return reply.status(400).send({
        error: err.errors[0].message,
      });
    }
  }
}
