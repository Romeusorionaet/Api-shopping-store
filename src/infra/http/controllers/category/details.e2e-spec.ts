import request from "supertest";
import { app } from "src/infra/app";
import { CategoryFactory } from "test/factories/make-category";

describe("Category Details (E2E)", () => {
  let categoryFactory: CategoryFactory;

  beforeAll(async () => {
    await app.ready();

    categoryFactory = new CategoryFactory();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[GET] /category/details/:id", async () => {
    const category = await categoryFactory.makePrismaCategory({
      title: "category for test get category details id",
    });

    const response = await request(app.server).get(
      `/category/details/${category.id}`,
    );

    expect(response.statusCode).toEqual(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        category: expect.objectContaining({
          title: "category for test get category details id",
        }),
      }),
    );
  });
});
