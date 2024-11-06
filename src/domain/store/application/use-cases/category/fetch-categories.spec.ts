import { InMemoryCategoriesRepository } from "test/repositories/in-memory-categories-repository";
import { FetchCategoriesUseCase } from "./fetch-categories";
import { makeCategory } from "test/factories/make-category";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";

let categoriesRepository: InMemoryCategoriesRepository;
let sut: FetchCategoriesUseCase;

describe("Fetch Categories", () => {
  beforeEach(() => {
    categoriesRepository = new InMemoryCategoriesRepository();
    sut = new FetchCategoriesUseCase(categoriesRepository);
  });

  test("should be able fetch categories", async () => {
    const category1 = makeCategory();
    const category2 = makeCategory();
    const category3 = makeCategory();

    await Promise.all([
      categoriesRepository.create(category1),
      categoriesRepository.create(category2),
      categoriesRepository.create(category3),
    ]);

    const result = await sut.execute({ page: 1 });

    expect(result.isRight()).toBe(true);
    expect(result.value?.categories).toHaveLength(3);
  });

  test("should be able fetch categories basic data when don't received page param", async () => {
    const category1 = makeCategory(
      { title: "iphone" },
      new UniqueEntityID("test-id-01"),
    );
    const category2 = makeCategory();
    const category3 = makeCategory();

    await categoriesRepository.create(category1);
    await categoriesRepository.create(category2);
    await categoriesRepository.create(category3);

    const result = await sut.execute({});

    expect(result.isRight()).toBe(true);
    expect(result.value?.categories).toHaveLength(3);
    expect(result.value?.categories[0]).toEqual(
      expect.objectContaining({
        id: "test-id-01",
        title: "iphone",
      }),
    );
  });
});
