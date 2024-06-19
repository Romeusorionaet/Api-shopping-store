import { FastifyRequest, FastifyReply } from "fastify";
import { ResourceNotFoundError } from "src/core/errors/resource-not-found-error";
import { makeConfirmEmailCase } from "src/domain/store/application/use-cases/user/factory/make-confirm-email-use-case";
import { z } from "zod";

const confirmEmailSchema = z.object({
  token: z.string().uuid(),
});

export async function confirmEmail(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { token } = confirmEmailSchema.parse(request.params);

    const confirmEmailUseCase = makeConfirmEmailCase();

    const result = await confirmEmailUseCase.execute({
      token,
    });

    if (result.isLeft()) {
      const err = result.value;
      switch (err.constructor) {
        case ResourceNotFoundError:
          return reply.status(400).send({
            error: err.message,
          });

        default:
          throw new Error(err.message);
      }
    }

    return reply.status(200).send({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return reply.status(400).send({
        error: err.errors[0].message,
        error_path: err.errors[0].path,
      });
    }
  }
}
