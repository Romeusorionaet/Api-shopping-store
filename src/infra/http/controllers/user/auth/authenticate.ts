import { FastifyRequest, FastifyReply } from "fastify";
import { InvalidCredentialsError } from "src/core/errors/invalid-credentials-errors";
import { makeAuthenticateUserUseCase } from "src/domain/store/application/use-cases/user/factory/make-authenticate-user-use-case";
import { z } from "zod";
import { RefreshTokenPresenter } from "../../../presenters/refresh-token-presenter";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createAuthenticateUserBodySchema = z.object({
    email: z.string().email(),
    password: z.string(),
  });

  const { email, password } = createAuthenticateUserBodySchema.parse(
    request.body,
  );

  const authenticateUserUseCase = makeAuthenticateUserUseCase();

  const result = await authenticateUserUseCase.execute({
    email,
    password,
  });

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

  return reply.status(201).send({
    accessToken: result.value.accessToken,
    refreshToken: RefreshTokenPresenter.toHTTP(result.value.refreshToken),
  });
}
