import { FastifyRequest, FastifyReply } from "fastify";
import { ProductPresenter } from "../../presenters/product-presenter";
import { z } from "zod";
import { makeSearchProductsUseCase } from "src/domain/store/application/use-cases/product/factory/make-search-products-use-case";
import { ProductNotFoundError } from "src/domain/store/application/use-cases/errors/product-not-found-error";
import { SectionForSearch } from "src/core/constants/section-for-search";

const querySchema = z.object({
  query: z.string().default(""),
  section: z
    .enum([SectionForSearch.DISCOUNT_PERCENTAGE, SectionForSearch.STARS])
    .nullable()
    .default(null),
  page: z.coerce.number().min(1).default(1),
});

export async function search(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { query, section, page } = querySchema.parse(request.query);

    const fetchProductsUseCase = makeSearchProductsUseCase();

    const result = await fetchProductsUseCase.execute({ query, section, page });

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

    return reply
      .status(200)
      .send({ products: result.value.products.map(ProductPresenter.toHTTP) });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return reply.status(400).send({
        error: err.errors[0].message,
        error_path: err.errors[0].path,
      });
    }
  }
}
