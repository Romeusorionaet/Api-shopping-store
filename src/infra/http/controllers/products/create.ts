import { ModeOfSale } from "@prisma/client";
import { FastifyRequest, FastifyReply } from "fastify";
import { CategoryTitleSentDoesNotMatchError } from "src/domain/store/application/use-cases/errors/category-title-sent-does-not-match-error";
import { ProductAlreadyExistsError } from "src/domain/store/application/use-cases/errors/product-already-exists-error";
import { TheAssignedCategoryDoesNotExistError } from "src/domain/store/application/use-cases/errors/the-assigned-category-does-not-exist-error";
import { makeCreateProductUseCase } from "src/domain/store/application/use-cases/product/factory/make-create-product-use-case";
import { z } from "zod";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createProductBodySchema = z.object({
    categoryId: z.string(),
    categoryTitle: z.string(),
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

  const productData = createProductBodySchema.parse(request.body);

  const createProductUseCase = makeCreateProductUseCase();

  const result = await createProductUseCase.execute(productData);

  if (result.isLeft()) {
    const err = result.value;
    switch (err.constructor) {
      case ProductAlreadyExistsError:
      case CategoryTitleSentDoesNotMatchError:
      case TheAssignedCategoryDoesNotExistError:
        return reply.status(400).send({
          error: err.message,
        });
      default:
        throw new Error(err.message);
    }
  }

  return reply.status(201).send();
}
