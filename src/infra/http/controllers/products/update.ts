import { FastifyRequest, FastifyReply } from "fastify";
import { ProductNotFoundError } from "src/domain/store/application/use-cases/errors/product-not-found-error";
import { TechnicalProductNotFoundError } from "src/domain/store/application/use-cases/errors/technical-product-details-not-found-error";
import { makeUpdateProductUseCase } from "src/domain/store/application/use-cases/product/factory/make-update-product-use-case";
import { z } from "zod";
import { productUpdateSchema } from "../../schemas/product-schema";

export async function update(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { product } = productUpdateSchema.parse(request.body);

    const updateProductUseCase = makeUpdateProductUseCase();

    const result = await updateProductUseCase.execute(product);

    if (result.isLeft()) {
      const err = result.value;
      switch (err.constructor) {
        case ProductNotFoundError:
          return reply.status(404).send({
            error: err.message,
          });
        case TechnicalProductNotFoundError:
          return reply.status(404).send({
            error: err.message,
          });

        default:
          throw new Error(err.message);
      }
    }

    return reply
      .status(201)
      .send({ message: "Produto atualizado com sucesso!" });
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.log(err.errors[0].path, "====err");
      return reply.status(400).send({
        error: err.errors[0].message,
        error_path: err.errors[0].path,
      });
    }
  }
}
