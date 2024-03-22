import { expect, describe, test, beforeEach } from "vitest";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { InMemoryCategoriesRepository } from "test/repositories/in-memory-categories-repository";
import { makeCategory } from "test/factories/make-category";
import { UpdateCategoryUseCase } from "./update-category";

let categoriesRepository: InMemoryCategoriesRepository;
let sut: UpdateCategoryUseCase;

describe("Update Category", () => {
  beforeEach(() => {
    categoriesRepository = new InMemoryCategoriesRepository();
    sut = new UpdateCategoryUseCase(categoriesRepository);
  });

  test("should be able to update category", async () => {
    const category = makeCategory(
      {
        title: "my category title 01",
        imgUrl: "https://url-test",
      },
      new UniqueEntityID("first-category-id-01"),
    );

    await categoriesRepository.create(category);

    const result = await sut.execute({
      id: category.id.toString(),
      title: "category updated",
      imgUrl: "https://url-test-updated",
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(categoriesRepository.items[0]).toEqual(
        expect.objectContaining({
          title: "category updated",
          imgUrl: "https://url-test-updated",
        }),
      );
    }
  });
});
