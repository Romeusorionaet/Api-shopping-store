import { hash } from "bcryptjs";
import { FastifyInstance } from "fastify";
import { prisma } from "src/infra/database/prisma/prisma";
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
    const user = await prisma.user.create({
      data: {
        username: "Romeu soares de souto",
        email: "romeusoaresdesouto@gmail.com",
        passwordHash: await hash("123456", 8),
      },
    });

    const result = await request(app.server)
      .post("/auth/user/authenticate")
      .send({
        email: "romeusoaresdesouto@gmail.com",
        password: "123456",
      });

    const { accessToken, refreshToken } = result.body;

    return { accessToken, refreshToken, user };
  }
}
