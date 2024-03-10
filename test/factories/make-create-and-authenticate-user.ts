import { hash } from "bcryptjs";
import { FastifyInstance } from "fastify";
import { prisma } from "src/infra/database/prisma/prisma";
import request from "supertest";

export async function createAndAuthenticateUser(app: FastifyInstance) {
  await prisma.user.create({
    data: {
      username: "Romeu soares de souto",
      email: "romeusoaresdesouto@gmail.com",
      passwordHash: await hash("123456", 8),
    },
  });

  const result = await request(app.server).post("/user/authenticate").send({
    email: "romeusoaresdesouto@gmail.com",
    password: "123456",
  });

  const { accessToken } = result.body;

  return { accessToken };
}
