import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { ProductPresenter } from "../../presenters/product-presenter";
import { makeFetchProductsUseCase } from "src/domain/store/application/use-cases/product/factory/make-fetch-products-use-case";

export async function fetchProducts(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchProductsSchema = z.object({
    page: z.coerce.number().min(1).default(1),
  });

  const { page } = fetchProductsSchema.parse(request.query);

  const fetchProductsUseCase = makeFetchProductsUseCase();

  const result = await fetchProductsUseCase.execute({ page });

  if (!result.value || result.value.products.length === 0) {
    return reply.status(200).send({
      message: "No products found.",
      products: [],
    });
  }

  return reply.status(200).send({
    products: result.value.products.map(ProductPresenter.toHTTP),
  });
}
