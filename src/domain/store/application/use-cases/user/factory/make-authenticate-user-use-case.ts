import { PrismaUserRepository } from "src/infra/database/prisma/repositories/prisma-user-repository";
import { JwtEncrypter } from "src/infra/cryptography/jwt-encrypter";
import { BcryptHash } from "src/infra/cryptography/bcrypt-hash";
import { AuthenticateUserUseCase } from "../auth/authenticate-user";
import { PrismaStaffRepository } from "src/infra/database/prisma/repositories/prisma-staff-respository";

export function makeAuthenticateUserUseCase() {
  const userRepository = new PrismaUserRepository();
  const bcrypt = new BcryptHash();
  const jwtEncrypter = new JwtEncrypter();
  const staffRepository = new PrismaStaffRepository();

  const useCase = new AuthenticateUserUseCase(
    userRepository,
    staffRepository,
    bcrypt,
    jwtEncrypter,
  );

  return useCase;
}
