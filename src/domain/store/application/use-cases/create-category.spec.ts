import { describe, test, beforeEach, expect } from "vitest";
import { CategoryAlreadyExistsError } from "src/core/errors/category-already-exists-error";
import { InMemoryCategoriesRepository } from "src/test/repositories/in-memory-categories-repository";
import { CreateCategoryUseCase } from "./create-category";
import { MakeCategory } from "src/test/factories/make-category";

let categoriesRepository: InMemoryCategoriesRepository;
let sut: CreateCategoryUseCase;

describe("Create Category", () => {
  beforeEach(() => {
    categoriesRepository = new InMemoryCategoriesRepository();
    sut = new CreateCategoryUseCase(categoriesRepository);
  });

  test("should be able create a category", async () => {
    const category = MakeCategory({ title: "First category test" });

    const result = await sut.execute(category);

    expect(result.isRight()).toBe(true);
    expect(categoriesRepository.items[0].title).toEqual("First category test");
  });

  test("should not be able create a category if the title already exists", async () => {
    await sut.execute({
      title: "First category test",
      imgUrl: "https://test",
    });

    const result = await sut.execute({
      title: "First category test",
      imgUrl: "https://test",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(CategoryAlreadyExistsError);
  });
});
