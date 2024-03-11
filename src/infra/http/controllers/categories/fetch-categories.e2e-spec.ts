import request from "supertest";
import { app } from "src/app";

describe("Fetch Categories (E2E)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test("should be able to fetch categories", async () => {
    await request(app.server).post("/category").send({
      title: "category title 01",
      imgUrl: "http://teste.com.br",
    });

    await request(app.server).post("/category").send({
      title: "category title 02",
      imgUrl: "http://teste.com.br",
    });

    const response = await request(app.server).get("/categories");

    expect(response.statusCode).toEqual(200);

    expect(response.body).toHaveLength(2);
  });
});
