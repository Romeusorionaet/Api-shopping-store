import { ModeOfSale } from "@prisma/client";
import { FastifyRequest, FastifyReply } from "fastify";
import { ProductNotFoundError } from "src/domain/store/application/use-cases/errors/product-not-found-error";
import { makeUpdateProductUseCase } from "src/domain/store/application/use-cases/product/factory/make-update-product-use-case";
import { z } from "zod";

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const updateProductBodySchema = z.object({
    id: z.string().uuid(),
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

      default:
        throw new Error(err.message);
    }
  }

  return reply.status(201).send();
}
