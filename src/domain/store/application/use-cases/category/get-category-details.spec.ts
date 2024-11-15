import { GetCategoryDetailsUseCase } from "./get-category-details";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { InMemoryCategoriesRepository } from "test/repositories/in-memory-categories-repository";
import { makeCategory } from "test/factories/make-category";
import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { InMemoryProductDataStoreRepository } from "test/repositories/in-memory-product-data-store-repository";
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";

let categoriesRepository: InMemoryCategoriesRepository;
let productsRepository: InMemoryProductsRepository;
let dataStore: InMemoryProductDataStoreRepository;
let ordersRepository: InMemoryOrdersRepository;
let usersRepository: InMemoryUsersRepository;
let sut: GetCategoryDetailsUseCase;

describe("Get Category Details", () => {
  beforeEach(() => {
    categoriesRepository = new InMemoryCategoriesRepository();
    dataStore = new InMemoryProductDataStoreRepository();
    usersRepository = new InMemoryUsersRepository();
    ordersRepository = new InMemoryOrdersRepository(
      productsRepository,
      usersRepository,
    );
    productsRepository = new InMemoryProductsRepository(
      dataStore,
      ordersRepository,
    );
    sut = new GetCategoryDetailsUseCase(
      categoriesRepository,
      productsRepository,
    );
  });

  test("should be able to get category details", async () => {
    const category = makeCategory(
      {
        title: "my category title 01",
      },
      new UniqueEntityID("first-category-id-01"),
    );

    await categoriesRepository.create(category);

    const result = await sut.execute({ id: category.id.toString() });

    expect(result.isRight()).toBe(true);
    expect(categoriesRepository.items).toHaveLength(1);

    if (result.isRight()) {
      expect(result.value.category).toEqual(
        expect.objectContaining({
          id: new UniqueEntityID("first-category-id-01"),
          title: "my category title 01",
        }),
      );
    }
  });
});
