import { FastifyRequest, FastifyReply } from "fastify";
import { InvalidTokenError } from "src/domain/store/application/use-cases/errors/invalid-token-error";
import { makeRefreshTokenUseCase } from "src/domain/store/application/use-cases/user/factory/make-refresh-token-use-case";
import { subSchema } from "src/infra/http/schemas/sub-schema";

export async function refreshToken(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { sub: id } = subSchema.parse(request.user);

  const refreshTokenUseCase = makeRefreshTokenUseCase();

  const result = await refreshTokenUseCase.execute({ userId: id });

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
    refreshToken: result.value.refreshToken,
  });
}
