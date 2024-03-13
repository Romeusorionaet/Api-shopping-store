import { FastifyRequest, FastifyReply } from "fastify";
import { makeFetchProductsUseCase } from "src/domain/store/application/use-cases/factories/make-fetch-products-use-case";
import { z } from "zod";
import { ProductPresenter } from "../../presenters/product-presenter";

export async function fetchProducts(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchProductsSchema = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1),
  });

  const { query, page } = fetchProductsSchema.parse(request.query);

  const fetchProductsUseCase = makeFetchProductsUseCase();

  const result = await fetchProductsUseCase.execute({ query, page });

  if (!result.value) {
    return reply.status(200).send([]);
  }

  return reply
    .status(200)
    .send({ products: result.value.products.map(ProductPresenter.toHTTP) });
}
