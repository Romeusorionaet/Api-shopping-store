import { InMemoryCategoryRepository } from "src/test/repositories/in-memory-category-repository";
import { describe, test, beforeEach, expect } from "vitest";
import { FetchCategoryUseCase } from "./fetch-category";
import { MakeCategory } from "src/test/factories/make-category";

let inMemoryCategoryRepository: InMemoryCategoryRepository;
let sut: FetchCategoryUseCase;

describe("Fetch Category", () => {
  beforeEach(() => {
    inMemoryCategoryRepository = new InMemoryCategoryRepository();
    sut = new FetchCategoryUseCase(inMemoryCategoryRepository);
  });

  test("should be able fetch categories", async () => {
    const category1 = MakeCategory();
    const category2 = MakeCategory();
    const category3 = MakeCategory();

    await inMemoryCategoryRepository.create(category1);
    await inMemoryCategoryRepository.create(category2);
    await inMemoryCategoryRepository.create(category3);

    const result = await sut.execute({ page: 1 });

    expect(result.isRight()).toBe(true);
    expect(result.value?.categories).toHaveLength(3);
  });
});
