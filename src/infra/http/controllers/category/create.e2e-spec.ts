import request from "supertest";
import { app } from "src/app";
import { prisma } from "src/infra/service/setup-prisma/prisma";

describe("Create Category (E2E)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[POST] /category", async () => {
    const response = await request(app.server).post("/category").send({
      title: "category test title create 01",
      imgUrl: "http://teste.com.br",
    });

    expect(response.statusCode).toEqual(201);

    const categoryOnDatabase = await prisma.category.findUnique({
      where: {
        title: "category test title create 01",
      },
    });

    expect(categoryOnDatabase).toBeTruthy();
  });

  test("[POST] should not be able to create a category twice with the same title", async () => {
    await request(app.server).post("/category").send({
      title: "category test title twice 02",
      imgUrl: "http://teste.com.br",
    });

    const response = await request(app.server).post("/category").send({
      title: "category test title twice 02",
      imgUrl: "http://teste.com.br",
    });

    expect(response.statusCode).toEqual(400);
  });
});
