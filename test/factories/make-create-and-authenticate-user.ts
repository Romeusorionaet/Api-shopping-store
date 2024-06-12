import { faker } from "@faker-js/faker";
import { hash } from "bcryptjs";
import { FastifyInstance } from "fastify";
import { prisma } from "src/infra/service/setup-prisma/prisma";
import request from "supertest";
import { FakeEncrypter } from "test/cryptography/fake-encrypter";

export async function makeAuthenticateUserWithTokens(userId: string) {
  const fakeEncrypter = new FakeEncrypter();
  const accessToken = await fakeEncrypter.encryptAccessToken({ sub: userId });
  const refreshToken = await fakeEncrypter.encryptRefreshToken({ sub: userId });

  return { accessToken, refreshToken };
}

export class CreateAndAuthenticateUserWithTokensFactory {
  async makePrismaCreateAndAuthenticateUserWithTokens(app: FastifyInstance) {
    const fakeFirstName = faker.person.firstName();

    const user = await prisma.user.create({
      data: {
        username: fakeFirstName,
        email: `${fakeFirstName}@gmail.com`,
        passwordHash: await hash("123456", 8),
      },
    });

    const result = await request(app.server)
      .post("/auth/user/authenticate")
      .send({
        email: `${fakeFirstName}@gmail.com`,
        password: "123456",
      });

    const { accessToken, refreshToken } = result.body;

    return { accessToken, refreshToken, user };
  }
}
