import request from "supertest";
import { app } from "src/infra/app";
import { ProductFactory } from "test/factories/make-product";
import { CategoryFactory } from "test/factories/make-category";

describe("Search Products (E2E)", () => {
  let productFactory: ProductFactory;
  let categoryFactory: CategoryFactory;

  beforeAll(async () => {
    await app.ready();

    productFactory = new ProductFactory();
    categoryFactory = new CategoryFactory();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[GET] /products/search", async () => {
    const category = await categoryFactory.makePrismaCategory();

    await Promise.all([
      productFactory.makePrismaProduct({
        categoryId: category.id,
        title: "product title 01",
      }),

      productFactory.makePrismaProduct({
        categoryId: category.id,
        title: "product title 02",
      }),
    ]);

    const response = await request(app.server)
      .get("/products/search")
      .query({ query: "01", page: 1 });

    expect(response.statusCode).toEqual(200);
    expect(response.body.products).toHaveLength(1);
    expect(response.body).toEqual({
      products: expect.arrayContaining([
        expect.objectContaining({ title: "product title 01" }),
      ]),
    });
  });

  test("[GET] /products/search - should be able to search with a section", async () => {
    const category = await categoryFactory.makePrismaCategory();

    await Promise.all([
      productFactory.makePrismaProduct({
        categoryId: category.id,
        title: "product title 03",
        stars: 0,
      }),

      productFactory.makePrismaProduct({
        categoryId: category.id,
        title: "product title 04",
        stars: 10,
      }),
    ]);

    const response = await request(app.server)
      .get("/products/search")
      .query({ query: "", section: "stars", page: 1 });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      products: expect.arrayContaining([
        expect.objectContaining({ title: "product title 04", stars: 10 }),
      ]),
    });
  });

  test("[GET] /products/search - should be able to search by category Id", async () => {
    const category = await categoryFactory.makePrismaCategory({
      title: "xiaomi",
    });
    const categorySecond = await categoryFactory.makePrismaCategory({
      title: "iphone",
    });

    await Promise.all([
      productFactory.makePrismaProduct({
        categoryId: category.id,
        categoryTitle: category.title,
        title: "readme note 7 pro",
      }),

      productFactory.makePrismaProduct({
        categoryId: category.id,
        categoryTitle: categorySecond.title,
        title: "iphone 15",
      }),
    ]);

    const response = await request(app.server)
      .get("/products/search")
      .query({ page: 1, categoryId: category.id });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      products: expect.arrayContaining([
        expect.objectContaining({
          categoryTitle: "xiaomi",
          title: "readme note 7 pro",
        }),
      ]),
    });
  });
});
