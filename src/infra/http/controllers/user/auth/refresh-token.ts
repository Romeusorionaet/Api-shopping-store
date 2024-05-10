import { FastifyRequest, FastifyReply } from "fastify";
import { InvalidTokenError } from "src/domain/store/application/use-cases/errors/invalid-token-error";
import { makeRefreshTokenUseCase } from "src/domain/store/application/use-cases/user/factory/make-refresh-token-use-case";
import { z } from "zod";
import { RefreshTokenPresenter } from "../../../presenters/refresh-token-presenter";

export async function refreshToken(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createRefreshTokenBodySchema = z.object({
    refreshId: z.string().uuid(),
  });

  const { refreshId } = createRefreshTokenBodySchema.parse(request.body);

  const refreshTokenUseCase = makeRefreshTokenUseCase();

  const result = await refreshTokenUseCase.execute({ refreshId });

  if (result.isLeft()) {
    const err = result.value;
    switch (err.constructor) {
      case InvalidTokenError:
        return reply.status(400).send({
          error: err.message,
        });

      default:
        throw new Error(err.message);
    }
  }

  return reply.status(201).send({
    accessToken: result.value.accessToken,
    newRefreshToken: result.value.newRefreshToken
      ? RefreshTokenPresenter.toHTTP(result.value.newRefreshToken)
      : null,
  });
}
