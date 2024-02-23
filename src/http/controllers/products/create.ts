import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createProductBodySchema = z.object({
    categoryId: z.string(),
    categoryTitle: z.string(),
    title: z.string(),
    description: z.string(),
    price: z.coerce.number(),
    imgUrlList: z.array(z.string()),
    stockQuantity: z.coerce.number(),
    minimumQuantityStock: z.coerce.number(),
    discountPercentage: z.coerce.number(),
    width: z.coerce.number(),
    height: z.coerce.number(),
    weight: z.coerce.number(),
    corsList: z.array(z.string()),
    placeOfSale: z.string(),
    star: z.coerce.number(),
  });

  const {
    categoryId,
    categoryTitle,
    title,
    description,
    price,
    imgUrlList,
    stockQuantity,
    minimumQuantityStock,
    discountPercentage,
    width,
    height,
    weight,
    corsList,
    placeOfSale,
    star,
  } = createProductBodySchema.parse(request.body);

  return reply.status(201).send();
}
