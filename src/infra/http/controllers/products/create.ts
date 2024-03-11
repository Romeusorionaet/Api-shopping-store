import { ModeOfSale } from "@prisma/client";
import { FastifyRequest, FastifyReply } from "fastify";
import { ProductAlreadyExistsError } from "src/domain/store/application/use-cases/errors/product-already-exists-error";
import { makeCreateProductUseCase } from "src/domain/store/application/use-cases/factories/make-create-product-use-case";
import { z } from "zod";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createProductBodySchema = z.object({
    categoryId: z.string(),
    categoryTitle: z.string(),
    title: z.string(),
    description: z.string(),
    price: z.coerce.number(),
    imgUrlList: z.array(z.string()),
    corsList: z.array(z.string()),
    stockQuantity: z.coerce.number(),
    minimumQuantityStock: z.coerce.number(),
    discountPercentage: z.coerce.number(),
    width: z.coerce.number(),
    height: z.coerce.number(),
    weight: z.coerce.number(),
    placeOfSale: z.enum([
      ModeOfSale.ONLINE_STORE,
      ModeOfSale.SELLS_ONLY_IN_THE_REGION,
    ]),
    stars: z.coerce.number(),
  });

  const productData = createProductBodySchema.parse(request.body);

  const createProductUseCase = makeCreateProductUseCase();

  const result = await createProductUseCase.execute(productData);

  if (result.isLeft()) {
    const err: ProductAlreadyExistsError = result.value;

    return reply.status(400).send({ error: err.message });
  }

  return reply.status(201).send();
}
