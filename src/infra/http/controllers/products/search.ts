import { FastifyRequest, FastifyReply } from "fastify";
import { ProductPresenter } from "../../presenters/product-presenter";
import { ResourceNotFoundError } from "src/core/errors/resource-not-found-error";
import { makeSearchProductsUseCase } from "src/domain/store/application/use-cases/factories/make-search-products-use-case";
import { z } from "zod";

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const fetchProductsSchema = z.object({
    query: z.string().min(1),
    page: z.coerce.number().min(1).default(1),
  });

  const { query, page } = fetchProductsSchema.parse(request.query);

  const fetchProductsUseCase = makeSearchProductsUseCase();

  const result = await fetchProductsUseCase.execute({ query, page });

  if (result.isLeft()) {
    const err: ResourceNotFoundError = result.value;

    return reply.status(400).send({ error: err.message });
  }

  return reply
    .status(200)
    .send({ products: result.value.products.map(ProductPresenter.toHTTP) });
}
