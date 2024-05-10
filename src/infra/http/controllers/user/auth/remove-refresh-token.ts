import { FastifyRequest, FastifyReply } from "fastify";
import { InvalidCredentialsError } from "src/core/errors/invalid-credentials-errors";
import { makeRemoveRefreshTokenUseCase } from "src/domain/store/application/use-cases/user/factory/make-remove-refresh-token-use-case";
import { z } from "zod";

export async function removeRefreshToken(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const removeRemoveRefreshTokenBodySchema = z.object({
    id: z.string().uuid(),
  });

  const { id } = removeRemoveRefreshTokenBodySchema.parse(request.body);

  const registerUserUseCase = makeRemoveRefreshTokenUseCase();

  const result = await registerUserUseCase.execute({ id });

  if (result.isLeft()) {
    const err = result.value;
    switch (err.constructor) {
      case InvalidCredentialsError:
        return reply.status(400).send({
          error: err.message,
        });

      default:
        throw new Error(err.message);
    }
  }

  return reply.status(201).send();
}
