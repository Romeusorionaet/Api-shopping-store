import { FastifyRequest, FastifyReply } from "fastify";
import { InvalidCredentialsError } from "src/core/errors/invalid-credentials-errors";
import { EmailNotVerifiedError } from "src/domain/store/application/use-cases/errors/email-not-verified-error";
import { makeAuthenticateUserUseCase } from "src/domain/store/application/use-cases/user/factory/make-authenticate-user-use-case";
import { authSchema } from "src/infra/http/schemas/auth-schema";
import { z } from "zod";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { email, password } = authSchema.parse(request.body);
    const authenticateUserUseCase = makeAuthenticateUserUseCase();

    const result = await authenticateUserUseCase.execute({
      email,
      password,
    });

    if (result.isLeft()) {
      const err = result.value;
      switch (err.constructor) {
        case InvalidCredentialsError:
        case EmailNotVerifiedError:
          return reply.status(400).send({
            error: err.message,
          });

        default:
          throw new Error(err.message);
      }
    }

    return reply.status(200).send({
      accessToken: result.value.accessToken,
      refreshToken: result.value.refreshToken,
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
