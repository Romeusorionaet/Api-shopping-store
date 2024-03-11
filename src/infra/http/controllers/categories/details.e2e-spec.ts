import request from "supertest";
import { app } from "src/app";

describe("Category Details (E2E)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test("should be able to get a category details", async () => {
    await request(app.server).post("/category").send({
      title: "category for test get category details id",
      imgUrl: "http://teste.com.br",
    });

    const responseCategories = await request(app.server).get("/categories");

    const categoryId = responseCategories.body[0].id;

    const response = await request(app.server).get(
      `/category/details/${categoryId}`,
    );

    expect(response.statusCode).toEqual(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        title: "category for test get category details id",
      }),
    );
  });
});
