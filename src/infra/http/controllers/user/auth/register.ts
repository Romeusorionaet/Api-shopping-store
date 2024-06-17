import { FastifyRequest, FastifyReply } from "fastify";
import { UserAlreadyExistsError } from "src/domain/store/application/use-cases/errors/user-already-exists-error";
import { makeRegisterUserUseCase } from "src/domain/store/application/use-cases/user/factory/make-register-user-use-case";
import { profileFromUserSchema } from "src/infra/http/schemas/profile-schema";
import { z } from "zod";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { username, email, password, picture } = profileFromUserSchema.parse(
      request.body,
    );

    const registerUserUseCase = makeRegisterUserUseCase();

    const result = await registerUserUseCase.execute({
      username,
      email,
      password,
      picture,
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

    return reply
      .status(201)
      .send({ message: "Usuário registrado com sucesso!" });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return reply.status(400).send({
        error: err.errors[0].message,
        path: err.errors[0].path, // TODO aplicar esse path em outros controllers
      });
    }
  }
}
