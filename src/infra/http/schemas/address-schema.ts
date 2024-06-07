import { z } from "zod";

const phoneNumberMessage = "Informe um número válido para contato.";

export const addressSchema = z.object({
  cep: z.coerce.number().refine((value) => value.toString().length === 8, {
    message: "O CEP deve ter 8 dígitos.",
  }),
  city: z.string().min(1, { message: "É preciso informar a cidade." }),
  uf: z.string().min(1, { message: "É preciso informar o UF." }),
  street: z.string().min(1, { message: "É preciso informar a rua." }),
  neighborhood: z.string().min(1, { message: "É preciso informar o bairro." }),
  houseNumber: z.coerce
    .number()
    .min(1, { message: "É preciso informar o número da casa." }),
  complement: z.string().min(1, {
    message:
      "É preciso informar algum complemento que possa ajudar na localição.",
  }),
  phoneNumber: z
    .string()
    .min(1, { message: phoneNumberMessage })
    .max(11, { message: phoneNumberMessage }),
  username: z
    .string()
    .min(1, { message: "É preciso informar o nome do comprador." }),
  email: z.string().min(1, { message: "É preciso informar o email." }),
});
