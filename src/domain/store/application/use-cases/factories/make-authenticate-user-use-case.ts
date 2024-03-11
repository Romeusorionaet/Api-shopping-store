import { PrismaUserRepository } from "src/infra/database/prisma/repositories/prisma-user-repository";
import { JwtEncrypter } from "src/infra/cryptography/jwt-encrypter";
import { AuthenticateUserUseCase } from "../authenticate-user";
import { BcryptHash } from "src/infra/cryptography/bcrypt-hash";

export function makeAuthenticateUserUseCase() {
  const userRepository = new PrismaUserRepository();
  const bcrypt = new BcryptHash();
  const jwtEncrypter = new JwtEncrypter();

  const useCase = new AuthenticateUserUseCase(
    userRepository,
    bcrypt,
    jwtEncrypter,
  );

  return useCase;
}
