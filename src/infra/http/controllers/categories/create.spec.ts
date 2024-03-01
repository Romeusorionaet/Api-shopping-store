import { test, describe, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "src/app";

describe("Create Category (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test("should be able to create a category", async () => {
    const response = await request(app.server).post("/category").send({
      title: "category test title create 01",
      imgUrl: "http://teste.com.br",
    });

    expect(response.statusCode).toEqual(201);
  });

  test("should not be able to create a category twice with the same title", async () => {
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
