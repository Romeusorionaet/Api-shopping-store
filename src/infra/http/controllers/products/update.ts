import { ModeOfSale } from "@prisma/client";
import { FastifyRequest, FastifyReply } from "fastify";
import { ProductNotFoundError } from "src/domain/store/application/use-cases/errors/product-not-found-error";
import { TechnicalProductNotFoundError } from "src/domain/store/application/use-cases/errors/technical-product-details-not-found-error";
import { makeUpdateProductUseCase } from "src/domain/store/application/use-cases/product/factory/make-update-product-use-case";
import { z } from "zod";

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const updateProductBodySchema = z.object({
    id: z.string().uuid(),
    title: z
      .string()
      .min(1, { message: "Adicione um título ao seu produto." })
      .max(100, {
        message:
          "O Título do seu produto deve conter no máximo 100 caracteres. Informações mais detalhada do produto pode ser registrado em descrição do produto.",
      }),
    description: z
      .string()
      .min(1, { message: "Adicione uma descrição ao seu produto." }),
    price: z.coerce.number(),
    imgUrlList: z.array(z.string()),
    corsList: z.array(z.string()),
    stockQuantity: z.coerce.number(),
    minimumQuantityStock: z.coerce.number(),
    discountPercentage: z.coerce.number(),
    placeOfSale: z.enum([
      ModeOfSale.ONLINE_STORE,
      ModeOfSale.SELLS_ONLY_IN_THE_REGION,
    ]),
    technicalProductDetails: z.object({
      technicalProductId: z.string().uuid(),
      width: z.string(),
      height: z.string(),
      weight: z.string(),
      brand: z.string(),
      model: z.string(),
      ram: z.string(),
      rom: z.string(),
      videoResolution: z.string(),
      batteryCapacity: z.string(),
      screenOrWatchFace: z.string(),
      averageBatteryLife: z.string(),
      videoCaptureResolution: z.string(),
      processorBrand: z.string(),
      operatingSystem: z.string(),
    }),
  });
  const productData = updateProductBodySchema.parse(request.body);

  const updateProductUseCase = makeUpdateProductUseCase();

  const result = await updateProductUseCase.execute(productData);

  if (result.isLeft()) {
    const err = result.value;
    switch (err.constructor) {
      case ProductNotFoundError:
        return reply.status(400).send({
          error: err.message,
        });
      case TechnicalProductNotFoundError:
        return reply.status(400).send({
          error: err.message,
        });

      default:
        throw new Error(err.message);
    }
  }

  return reply.status(201).send();
}
