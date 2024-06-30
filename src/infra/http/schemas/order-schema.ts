import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { z } from "zod";

const uuidType = z.string().refine((value) => {
  return value;
});

export const orderSchema = z.object({
  orderProducts: z.array(
    z.object({
      productId: uuidType.transform((value) => new UniqueEntityID(value)),
      imgUrl: z
        .string()
        .min(1, { message: "É preciso informar a imagem do produto." }),
      title: z
        .string()
        .min(1, { message: "É preciso informar o título do produto." }),
      description: z
        .string()
        .min(1, { message: "É preciso informar a descrição do produto." }),
      basePrice: z.coerce
        .number()
        .min(1, { message: "É preciso informar o valor do produto." }),
      discountPercentage: z.coerce.number(),
      quantity: z.coerce
        .number()
        .min(1, { message: "É preciso informar a quantidade do produto." }),
      colorList: z
        .array(z.string())
        .min(1, { message: "É preciso informar a cor do produto." }),
    }),
  ),
});
