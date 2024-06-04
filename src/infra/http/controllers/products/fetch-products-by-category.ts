import { FastifyRequest, FastifyReply } from "fastify";
import { ProductPresenter } from "../../presenters/product-presenter";
import { z } from "zod";
import { makeFetchProductsByCategoryUseCase } from "src/domain/store/application/use-cases/product/factory/make-fetch-products-by-category-use-case";
import { ProductsNotFoundForThisCategoryError } from "src/domain/store/application/use-cases/errors/products-not-found-for-this-category-error";

export async function fetchProductsByCategory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchProductsSchema = z.object({
    categoryId: z.string().min(1),
    page: z.coerce.number().min(1).default(1),
  });

  const { categoryId, page } = fetchProductsSchema.parse(request.query);
  const fetchProductsByCategoryUseCase = makeFetchProductsByCategoryUseCase();

  const result = await fetchProductsByCategoryUseCase.execute({
    categoryId,
    page,
  });

  if (result.isLeft()) {
    const err = result.value;
    switch (err.constructor) {
      case ProductsNotFoundForThisCategoryError:
        return reply.status(400).send({
          error: err.message,
        });

      default:
        throw new Error(err.message);
    }
  }

  return reply
    .status(200)
    .send({ products: result.value.products.map(ProductPresenter.toHTTP) });
}
