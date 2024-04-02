import { FastifyRequest, FastifyReply } from "fastify";
import { UserAlreadyExistsError } from "src/domain/store/application/use-cases/errors/user-already-exists-error";
import { makeRegisterUserUseCase } from "src/domain/store/application/use-cases/user/factory/make-register-user-use-case";
import { z } from "zod";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const createRegisterUserBodySchema = z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string(),
  });

  const { username, email, password } = createRegisterUserBodySchema.parse(
    request.body,
  );

  const registerUserUseCase = makeRegisterUserUseCase();

  const result = await registerUserUseCase.execute({
    username,
    email,
    password,
  });

  if (result.isLeft()) {
    const err = result.value;
    switch (err.constructor) {
      case UserAlreadyExistsError:
        return reply.status(400).send({
          error: err.message,
        });

      default:
        throw new Error(err.message);
    }
  }

  return reply.status(201).send();
}
