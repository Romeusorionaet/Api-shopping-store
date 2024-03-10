import { describe, test, beforeEach, expect } from "vitest";
import { InMemoryCategoriesRepository } from "test/repositories/in-memory-categories-repository";
import { FetchCategoriesUseCase } from "./fetch-categories";
import { MakeCategory } from "test/factories/make-category";

let categoriesRepository: InMemoryCategoriesRepository;
let sut: FetchCategoriesUseCase;

describe("Fetch Categories", () => {
  beforeEach(() => {
    categoriesRepository = new InMemoryCategoriesRepository();
    sut = new FetchCategoriesUseCase(categoriesRepository);
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
