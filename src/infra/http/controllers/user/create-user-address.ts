import { FastifyRequest, FastifyReply } from "fastify";
import { UserNotFoundError } from "src/core/errors/user-not-found-error";
import { makeCreateUserAddressUseCase } from "src/domain/store/application/use-cases/user/factory/make-create-user-address-use-case";
import { AddressAlreadyExistError } from "src/domain/store/application/use-cases/errors/address-already-exist-error";
import { z } from "zod";

export async function createUserAddress(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createUserAddressBodySchema = z.object({
    cep: z.coerce.number().refine((value) => value.toString().length === 8, {
      message: "O CEP deve ter 8 dígitos",
    }),
    city: z.string(),
    uf: z.string(),
    street: z.string(),
    neighborhood: z.string(),
    houseNumber: z.coerce.number(),
    complement: z.string(),
    phoneNumber: z.string(),
    username: z.string(),
    email: z.string(),
  });

  const userSchema = z.object({
    sub: z.string().uuid(),
  });

  const dataUserAddress = createUserAddressBodySchema.parse(request.body);
  const { sub: userId } = userSchema.parse(request.user);

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

  return reply.status(201).send();
}
