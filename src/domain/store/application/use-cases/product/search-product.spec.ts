import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { makeProduct } from "test/factories/make-product";
import { SearchProductsUseCase } from "./search-products";
import { makeCategory } from "test/factories/make-category";
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository";
import { InMemoryProductRatingRepository } from "test/repositories/in-memory-product-rating-repository";
import { InMemoryProductDataStoreRepository } from "test/repositories/in-memory-product-data-store-repository";

let productsRepository: InMemoryProductsRepository;
let productDataStoreRepository: InMemoryProductDataStoreRepository;
let orderRepository: InMemoryOrdersRepository;
let productRatingRepository: InMemoryProductRatingRepository;
let sut: SearchProductsUseCase;

describe("Search Products", () => {
  beforeEach(() => {
    orderRepository = new InMemoryOrdersRepository(productsRepository);

    productDataStoreRepository = new InMemoryProductDataStoreRepository();

    productsRepository = new InMemoryProductsRepository(
      productDataStoreRepository,
      orderRepository,
    );

    productRatingRepository = new InMemoryProductRatingRepository(
      productDataStoreRepository,
    );

    sut = new SearchProductsUseCase(
      productsRepository,
      productRatingRepository,
    );
  });

  test("should be able to search products", async () => {
    const products1 = makeProduct({ title: "product javascript" });
    const products2 = makeProduct({ title: "product python" });
    const products3 = makeProduct({ title: "product java" });

    await Promise.all([
      productsRepository.create(products1),
      productsRepository.create(products2),
      productsRepository.create(products3),
    ]);

    const result = await sut.execute({ query: "java", section: "", page: 1 });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.products).toHaveLength(2);
    }
  });

  test("should be able to fetch paginated products by search", async () => {
    for (let i = 1; i <= 22; i++) {
      await productsRepository.create(makeProduct({ title: `product ${i}` }));
    }

    const result = await sut.execute({
      query: "product",
      section: "",
      page: 2,
    });

    if (result.isRight()) {
      expect(result.value.products).toHaveLength(2);
      expect(result.value.products).toEqual([
        expect.objectContaining({ title: "product 21" }),
        expect.objectContaining({ title: "product 22" }),
      ]);
    }
  });

  test("should be able to search for products by category title", async () => {
    const firstCategory = makeCategory({ title: "first category" });
    const secondCategory = makeCategory({ title: "second category" });

    const firstProduct = makeProduct({
      categoryId: firstCategory.id,
      categoryTitle: firstCategory.title,
    });

    const secondProduct = makeProduct({
      categoryId: firstCategory.id,
      categoryTitle: firstCategory.title,
    });

    const thirdProduct = makeProduct({
      categoryId: secondCategory.id,
      categoryTitle: secondCategory.title,
    });

    await Promise.all([
      productsRepository.create(firstProduct),
      productsRepository.create(secondProduct),
      productsRepository.create(thirdProduct),
    ]);

    const result = await sut.execute({ query: "first", section: "", page: 1 });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.products).toHaveLength(2);
    }
  });

  test("should be able to search only for products whose discount percentage is greater than 0", async () => {
    const category = makeCategory({ title: "first category" });

    const firstProduct = makeProduct({
      categoryId: category.id,
      categoryTitle: category.title,
      title: "Iphone",
      discountPercentage: 50,
    });

    const secondProduct = makeProduct({
      categoryId: category.id,
      categoryTitle: category.title,
      title: "Xiaomi",
      discountPercentage: 0,
    });

    await Promise.all([
      productsRepository.create(firstProduct),
      productsRepository.create(secondProduct),
    ]);

    const result = await sut.execute({
      query: "",
      section: "discountPercentage",
      page: 1,
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.products).toHaveLength(1);
      expect(result.value.products).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: "Iphone",
            discountPercentage: 50,
          }),
        ]),
      );
    }
  });

  test("should be able to search only for products whose stars is greater than 0", async () => {
    const category = makeCategory({ title: "first category" });

    const firstProduct = makeProduct({
      categoryId: category.id,
      categoryTitle: category.title,
      title: "Iphone",
      stars: 0,
    });

    const secondProduct = makeProduct({
      categoryId: category.id,
      categoryTitle: category.title,
      title: "Xiaomi",
      stars: 10,
    });

    await Promise.all([
      await productsRepository.create(firstProduct),
      await productsRepository.create(secondProduct),
    ]);

    const result = await sut.execute({
      query: "",
      section: "stars",
      page: 1,
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.products).toHaveLength(1);
      expect(result.value.products).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: "Xiaomi",
            stars: 10,
          }),
        ]),
      );
    }
  });
});
