import { FastifyRequest, FastifyReply } from "fastify";
import { AddressNotFoundError } from "src/domain/store/application/use-cases/errors/address-not-found-error";
import { makeUpdateBuyerAddressUseCase } from "src/domain/store/application/use-cases/factories/make-update-buyer-address-use-case";
import { z } from "zod";

export async function updateBuyerAddress(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateBuyerAddressBodySchema = z.object({
    addressId: z.string(),
    cep: z.coerce.number().refine((value) => value.toString().length === 8, {
      message: "O CEP deve ter 8 dígitos",
    }),
    city: z.string(),
    uf: z.string(),
    street: z.string(),
    neighborhood: z.string(),
    houseNumber: z.coerce.number(),
    complement: z.string(),
    phoneNumber: z.coerce
      .number()
      .refine((value) => value.toString().length === 10, {
        message: "Número de telefone inválido",
      }),
    username: z.string(),
    email: z.string(),
  });
  const dataBuyerAddress = updateBuyerAddressBodySchema.parse(request.body);

  const updateBuyerAddressUseCase = makeUpdateBuyerAddressUseCase();

  const result = await updateBuyerAddressUseCase.execute(dataBuyerAddress);

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

  return reply.status(201).send();
}