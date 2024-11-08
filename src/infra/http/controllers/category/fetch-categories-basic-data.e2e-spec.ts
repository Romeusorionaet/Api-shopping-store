import request from "supertest";
import { app } from "src/infra/app";
import { CategoryFactory } from "test/factories/make-category";

describe("Fetch Categories basic data (E2E)", () => {
  let categoryFactory: CategoryFactory;

  beforeAll(async () => {
    await app.ready();

    categoryFactory = new CategoryFactory();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[GET] /categories/basic-data", async () => {
    await Promise.all([
      categoryFactory.makePrismaCategory({
        title: "category title 01",
      }),

      categoryFactory.makePrismaCategory({
        title: "category title 02",
      }),
    ]);

    const response = await request(app.server).get("/categories/basic-data");

    expect(response.statusCode).toEqual(200);

    expect(response.body.categoriesBasicData).toHaveLength(2);
    expect(response.body).toEqual({
      categoriesBasicData: expect.arrayContaining([
        expect.objectContaining({ title: "category title 01" }),
        expect.objectContaining({ title: "category title 02" }),
      ]),
    });
  });
});
