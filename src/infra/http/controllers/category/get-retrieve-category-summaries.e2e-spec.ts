import { CreateAndAuthenticateUserAdminWithTokensFactory } from "test/factories/make-create-and-authenticate-user";
import { CategoryFactory } from "test/factories/make-category";
import { app } from "src/infra/app";
import request from "supertest";
import { ProductFactory } from "test/factories/make-product";

describe("Get retrieve category summaries (E2E)", () => {
  let createAndAuthenticateUserAdminWithTokensFactory: CreateAndAuthenticateUserAdminWithTokensFactory;
  let categoryFactory: CategoryFactory;
  let productFactory: ProductFactory;

  beforeAll(async () => {
    await app.ready();

    categoryFactory = new CategoryFactory();
    productFactory = new ProductFactory();

    createAndAuthenticateUserAdminWithTokensFactory =
      new CreateAndAuthenticateUserAdminWithTokensFactory();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[GET] /category/retrieve-summaries", async () => {
    const { accessToken } =
      await createAndAuthenticateUserAdminWithTokensFactory.makePrismaCreateAndAuthenticateUserAdminWithTokens(
        app,
      );

    const category1 = await categoryFactory.makePrismaCategory({
      title: "Iphone",
    });

    const category2 = await categoryFactory.makePrismaCategory({
      title: "Xiaomi",
    });

    await productFactory.makePrismaProduct({
      categoryId: category1.id,
    });

    const response = await request(app.server)
      .get("/category/retrieve-summaries")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.RetrieveCategorySummaries).toHaveLength(2);
    expect(response.body).toEqual(
      expect.objectContaining({
        RetrieveCategorySummaries: expect.arrayContaining([
          expect.objectContaining({
            id: category1.id.toString(),
            title: category1.title,
            productCount: 1,
          }),
          expect.objectContaining({
            id: category2.id.toString(),
            title: category2.title,
            productCount: 0,
          }),
        ]),
      }),
    );
  });
});
