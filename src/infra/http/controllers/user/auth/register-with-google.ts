import { FastifyReply, FastifyRequest } from "fastify";
import { InvalidCredentialsError } from "src/core/errors/invalid-credentials-errors";
import { makeRegisterUserWithGoogleUseCase } from "src/domain/store/application/use-cases/user/factory/make-register-user-with-google-use-case";
import { makeAuthenticateUserWithGoogleUseCase } from "src/domain/store/application/use-cases/user/factory/make-authenticate-user-with-google-use-case";
import { env } from "src/infra/env";
import { z } from "zod";

export async function registerWithGoogle(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const getProfileSchema = z.object({
      email: z.string(),
      username: z.string(),
      picture: z.string().optional(),
    });

    const { email, username } = getProfileSchema.parse(request.body);

    const registerUserWithGoogleUseCase = makeRegisterUserWithGoogleUseCase();

    const resultRegisterWithGoogle =
      await registerUserWithGoogleUseCase.execute({
        email,
        username,
      });

    const user = resultRegisterWithGoogle.user;

    const authenticateUserWithGoogleUseCase =
      makeAuthenticateUserWithGoogleUseCase();

    const result = await authenticateUserWithGoogleUseCase.execute({
      userId: user.id.toString(),
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
    return reply
      .status(500)
      .send(`Failed to process Google OAuth login. ${err.message}`);
  }
}
