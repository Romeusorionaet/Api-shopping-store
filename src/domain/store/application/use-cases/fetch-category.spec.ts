import { describe, test, beforeEach, expect } from "vitest";
import { FetchCategoryUseCase } from "./fetch-category";
import { MakeCategory } from "src/test/factories/make-category";
import { InMemoryCategoriesRepository } from "src/test/repositories/in-memory-categories-repository";

let categoriesRepository: InMemoryCategoriesRepository;
let sut: FetchCategoryUseCase;

describe("Fetch Category", () => {
  beforeEach(() => {
    categoriesRepository = new InMemoryCategoriesRepository();
    sut = new FetchCategoryUseCase(categoriesRepository);
  });

  test("should be able fetch categories", async () => {
    const category1 = MakeCategory();
    const category2 = MakeCategory();
    const category3 = MakeCategory();

    await categoriesRepository.create(category1);
    await categoriesRepository.create(category2);
    await categoriesRepository.create(category3);

    const result = await sut.execute({ page: 1 });

    expect(result.isRight()).toBe(true);
    expect(result.value?.categories).toHaveLength(3);
  });
});
