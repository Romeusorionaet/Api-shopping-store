import { FastifyRequest, FastifyReply } from "fastify";
import { ProductPresenter } from "../../presenters/product-presenter";
import { z } from "zod";
import { makeGetProductDetailsUseCase } from "src/domain/store/application/use-cases/product/factory/make-get-product-details-use-case";
import { ProductNotFoundError } from "src/domain/store/application/use-cases/errors/product-not-found-error";
import { TechnicalProductNotFoundError } from "src/domain/store/application/use-cases/errors/technical-product-details-not-found-error";
import { TechnicalProductDetailsPresenter } from "../../presenters/technical-product-details-presenter";

const paramsSchema = z.object({
  productId: z.string().uuid(),
});

export async function details(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { productId } = paramsSchema.parse(request.params);

    const getProductDetailsUseCase = makeGetProductDetailsUseCase();

    const result = await getProductDetailsUseCase.execute({ productId });

    if (result.isLeft()) {
      const err = result.value;
      switch (err.constructor) {
        case ProductNotFoundError:
        case TechnicalProductNotFoundError:
          return reply.status(400).send({
            error: err.message,
          });

        default:
          throw new Error(err.message);
      }
    }

    return reply.status(200).send({
      product: ProductPresenter.toHTTP(result.value.product),
      technicalProductDetails: TechnicalProductDetailsPresenter.toHTTP(
        result.value.technicalProductDetails,
      ),
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return reply.status(400).send({
        error: err.errors[0].message,
        error_path: err.errors[0].path,
      });
    }
  }
}
