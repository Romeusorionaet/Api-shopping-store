import { InMemoryCategoryRepository } from "src/test/repositories/in-memory-category-repository";
import { describe, test, beforeEach, expect } from "vitest";
import { CreateCategoryUseCase } from "./create-category";

let inMemoryCategoryRepository = new InMemoryCategoryRepository();
let sut: CreateCategoryUseCase;

describe("Create Category", () => {
  beforeEach(() => {
    inMemoryCategoryRepository = new InMemoryCategoryRepository();
    sut = new CreateCategoryUseCase(inMemoryCategoryRepository);
  });

  test("should be create a category", async () => {
    const result = await sut.execute({
      title: "First category test",
      productQuantity: 0,
      imgUrl: "https://test",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.category.title.toString()).toEqual(
      "First category test",
    );
  });
});
