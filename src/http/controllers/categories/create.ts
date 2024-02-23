import { FastifyRequest, FastifyReply } from "fastify";
import { CategoryAlreadyExistsError } from "src/core/errors/category-already-exists-error";
import { makeCreateCategoryUseCase } from "src/domain/store/application/use-cases/factories/make-create-category-use-case";
import { z } from "zod";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createCategoryBodySchema = z.object({
    title: z.string(),
    productQuantity: z.coerce.number(),
    imgUrl: z.string(),
  });

  const { title, productQuantity, imgUrl } = createCategoryBodySchema.parse(
    request.body,
  );

  const createCategoryUseCase = makeCreateCategoryUseCase();

  const result = await createCategoryUseCase.execute({
    title,
    productQuantity,
    imgUrl,
  });

  if (result.isLeft()) {
    const err: CategoryAlreadyExistsError = result.value;

    return reply.status(400).send({ error: err.message });
  }

  return reply.status(201).send();
}
