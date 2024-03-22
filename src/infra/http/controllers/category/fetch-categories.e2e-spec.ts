import request from "supertest";
import { app } from "src/app";
import { CategoryFactory } from "test/factories/make-category";

describe("Fetch Categories (E2E)", () => {
  let categoryFactory: CategoryFactory;

  beforeAll(async () => {
    await app.ready();

    categoryFactory = new CategoryFactory();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[GET] /categories", async () => {
    await Promise.all([
      categoryFactory.makePrismaCategory({
        title: "category title 01",
      }),

      categoryFactory.makePrismaCategory({
        title: "category title 02",
      }),
    ]);

    const response = await request(app.server).get("/categories");

    expect(response.statusCode).toEqual(200);

    expect(response.body.categories).toHaveLength(2);
    expect(response.body).toEqual({
      categories: expect.arrayContaining([
        expect.objectContaining({ title: "category title 01" }),
        expect.objectContaining({ title: "category title 02" }),
      ]),
    });
  });
});
