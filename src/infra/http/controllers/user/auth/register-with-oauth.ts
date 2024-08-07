import { FastifyReply, FastifyRequest } from "fastify";
import { InvalidCredentialsError } from "src/core/errors/invalid-credentials-errors";
import { env } from "src/infra/env";
import { z } from "zod";
import { profileFromGoogleSchema } from "src/infra/http/schemas/profile-schema";
import { makeRefreshTokenUseCase } from "src/domain/store/application/use-cases/user/factory/make-refresh-token-use-case";
import { makeRegisterUserWithOAuthUseCase } from "src/domain/store/application/use-cases/user/factory/make-register-user-with-oauth-use-case";

export async function registerWithOAuth(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { email, username, picture, emailVerified } =
      profileFromGoogleSchema.parse(request.body);

    const registerUserWithOAuthUseCase = makeRegisterUserWithOAuthUseCase();

    const resultRegisterWithOAuth = await registerUserWithOAuthUseCase.execute({
      email,
      username,
      picture,
      emailVerified,
    });

    const user = resultRegisterWithOAuth.user;

    const refreshTokenUseCase = makeRefreshTokenUseCase();

    const result = await refreshTokenUseCase.execute({
      userId: user.id.toString(),
      publicId: user.publicId.toString(),
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

    return reply.send(result.value).redirect(env.SHOPPING_STORE_URL_WEB);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return reply.status(400).send({
        error: err.errors[0].message,
        error_path: err.errors[0].path,
      });
    } else {
      return reply
        .status(500)
        .send(`Failed to process Google OAuth login. ${err.message}`);
    }
  }
}
