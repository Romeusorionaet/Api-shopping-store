import { test, describe, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "src/app";
import { MakeCategory } from "src/test/factories/make-category";

describe("Create Category (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test("should be able to create a category", async () => {
    const response = await request(app.server).post("/category").send({
      title: "teste",
      productQuantity: 1,
      imgUrl: "http://teste.com.br",
    });

    expect(response.statusCode).toEqual(201);
  });

  test("should not be able to create a category twice with the same name", async () => {
    const category = MakeCategory({ title: "title-test-category" });

    await request(app.server).post("/category").send({
      category,
    });

    const response = await request(app.server).post("/category").send({
      category,
    });

    expect(response.statusCode).toEqual(400);
  });
});
