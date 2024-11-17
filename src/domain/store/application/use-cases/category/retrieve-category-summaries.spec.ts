import { InMemoryCategoriesRepository } from "test/repositories/in-memory-categories-repository";
import { makeCategory } from "test/factories/make-category";
import { InMemoryProductDataStoreRepository } from "test/repositories/in-memory-product-data-store-repository";
import { makeProduct } from "test/factories/make-product";
import { RetrieveCategorySummariesUseCase } from "./retrieve-category-summaries";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";

let categoriesRepository: InMemoryCategoriesRepository;
let dataStore: InMemoryProductDataStoreRepository;
let sut: RetrieveCategorySummariesUseCase;

describe("Retrieve category summaries", () => {
  beforeEach(() => {
    dataStore = new InMemoryProductDataStoreRepository();
    categoriesRepository = new InMemoryCategoriesRepository(dataStore);
    sut = new RetrieveCategorySummariesUseCase(categoriesRepository);
  });

  test("should be able fetch retrieve category summaries", async () => {
    const category1 = makeCategory(
      { title: "Iphone" },
      new UniqueEntityID("id-category-1"),
    );
    const category2 = makeCategory(
      { title: "Xiaomi" },
      new UniqueEntityID("id-category-2"),
    );

    const product1 = makeProduct({
      categoryId: category1.id,
    });
    const product2 = makeProduct({ categoryId: category1.id });

    await Promise.all([
      categoriesRepository.create(category1),
      categoriesRepository.create(category2),
    ]);

    await Promise.all([
      dataStore.items.push(product1),
      dataStore.items.push(product2),
    ]);

    const result = await sut.execute();

    expect(result.isRight()).toBe(true);
    expect(result.value?.categorySummaries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: category1.id.toString(),
          title: category1.title,
          productCount: 2,
        }),
        expect.objectContaining({
          id: category2.id.toString(),
          title: category2.title,
          productCount: 0,
        }),
      ]),
    );
  });
});
