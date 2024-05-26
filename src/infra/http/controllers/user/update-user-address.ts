import { FastifyRequest, FastifyReply } from "fastify";
import { AddressNotFoundError } from "src/domain/store/application/use-cases/errors/address-not-found-error";
import { makeUpdateUserAddressUseCase } from "src/domain/store/application/use-cases/user/factory/make-update-user-address-use-case";
import { z } from "zod";

export async function updateUserAddress(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateUserAddressBodySchema = z.object({
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

  const userSchema = z.object({ sub: z.string().uuid() });

  const dataUserAddress = updateUserAddressBodySchema.parse(request.body);
  const { sub: userId } = userSchema.parse(request.user);

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
}
