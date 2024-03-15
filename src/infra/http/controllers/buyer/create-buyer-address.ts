import { FastifyRequest, FastifyReply } from "fastify";
import { UserNotFoundError } from "src/core/errors/user-not-found-error";
import { makeCreateBuyerAddressUseCase } from "src/domain/store/application/use-cases/factories/make-create-buyer-address-use-case";
import { z } from "zod";

export async function createBuyerAddress(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createBuyerAddressBodySchema = z.object({
    buyerId: z.string(),
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
        message: "O número de telefone deve ter 8 dígitos",
      }),
    username: z.string(),
    email: z.string(),
  });

  const dataBuyerAddress = createBuyerAddressBodySchema.parse(request.body);

  const createBuyerAddressUseCase = makeCreateBuyerAddressUseCase();

  const result = await createBuyerAddressUseCase.execute(dataBuyerAddress);

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

  return reply.status(201).send();
}
