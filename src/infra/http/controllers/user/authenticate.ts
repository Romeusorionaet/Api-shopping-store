import { FastifyRequest, FastifyReply } from "fastify";
import { InvalidCredentialsError } from "src/core/errors/invalid-credentials-errors";
import { makeAuthenticateUserUseCase } from "src/domain/store/application/use-cases/factories/make-authenticate-user-use-case";
import { z } from "zod";

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

  const registerUserUseCase = makeAuthenticateUserUseCase();

  const result = await registerUserUseCase.execute({
    email,
    password,
  });

  if (result.isLeft()) {
    const err: InvalidCredentialsError = result.value;

    return reply.status(400).send({ error: err.message });
  }

  return reply.status(201).send(result.value);
}
