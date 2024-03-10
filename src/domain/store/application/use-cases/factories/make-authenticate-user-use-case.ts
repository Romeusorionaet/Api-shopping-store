import { PrismaUserRepository } from "src/infra/database/prisma/repositories/prisma-user-repository";
import { Bcrypt } from "src/infra/cryptography/jwt-encrypter";
import { AuthenticateUserUseCase } from "../authenticate-user";
import { JwtEncrypter } from "src/infra/cryptography/bcrypt-hasher";

export function makeAuthenticateUserUseCase() {
  const userRepository = new PrismaUserRepository();
  const bcrypt = new Bcrypt();
  const jwtEncrypter = new JwtEncrypter();

  const useCase = new AuthenticateUserUseCase(
    userRepository,
    bcrypt,
    jwtEncrypter,
  );

  return useCase;
}
