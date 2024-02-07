import { InMemoryCategoryRepository } from "src/test/repositories/in-memory-category-repository";
import { describe, test, beforeEach, expect } from "vitest";
import { CreateCategoryUseCase } from "./create-category";
import { AlreadyExistsError } from "src/core/errors/already-exists-error";

let inMemoryCategoryRepository = new InMemoryCategoryRepository();
let sut: CreateCategoryUseCase;

describe("Create Category", () => {
  beforeEach(() => {
    inMemoryCategoryRepository = new InMemoryCategoryRepository();
    sut = new CreateCategoryUseCase(inMemoryCategoryRepository);
  });

  test("should be able create a category", async () => {
    const result = await sut.execute({
      title: "First category test",
      productQuantity: 0,
      imgUrl: "https://test",
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryCategoryRepository.items[0].title).toEqual(
      "First category test",
    );
  });

  test("should not be able create a category if the title already exists", async () => {
    await sut.execute({
      title: "First category test",
      productQuantity: 0,
      imgUrl: "https://test",
    });

    const result = await sut.execute({
      title: "First category test",
      productQuantity: 0,
      imgUrl: "https://test",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(AlreadyExistsError);
  });
});
