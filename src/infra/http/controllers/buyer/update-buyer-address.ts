import { FastifyRequest, FastifyReply } from "fastify";
import { makeUpdateBuyerAddressUseCase } from "src/domain/store/application/use-cases/buyer/factory/make-update-buyer-address-use-case";
import { AddressNotFoundError } from "src/domain/store/application/use-cases/errors/address-not-found-error";
import { z } from "zod";

export async function updateBuyerAddress(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateBuyerAddressBodySchema = z.object({
    id: z.string(),
    cep: z.coerce.number().refine((value) => value.toString().length === 8, {
      message: "O CEP deve ter 8 dígitos.",
    }),
    city: z.string().min(1, { message: "É preciso informar a cidade." }),
    uf: z.string().min(1, { message: "É preciso informar o UF." }),
    street: z.string().min(1, { message: "É preciso informar a rua." }),
    neighborhood: z
      .string()
      .min(1, { message: "É preciso informar o bairro." }),
    houseNumber: z.coerce
      .number()
      .min(1, { message: "É preciso informar o número da casa." }),
    complement: z.string().min(1, {
      message:
        "É preciso informar algum complemento que possa ajudar na localição.",
    }),
    phoneNumber: z
      .string()
      .min(1, { message: "É preciso informar o número para contato." }),
    username: z
      .string()
      .min(1, { message: "É preciso informar o nome do comprador." }),
    email: z.string().min(1, { message: "É preciso informar o email." }),
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
