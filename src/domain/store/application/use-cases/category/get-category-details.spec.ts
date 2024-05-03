import { GetCategoryDetailsUseCase } from "./get-category-details";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { InMemoryCategoriesRepository } from "test/repositories/in-memory-categories-repository";
import { makeCategory } from "test/factories/make-category";

let categoriesRepository: InMemoryCategoriesRepository;
let sut: GetCategoryDetailsUseCase;

describe("Get Category Details", () => {
  beforeEach(() => {
    categoriesRepository = new InMemoryCategoriesRepository();
    sut = new GetCategoryDetailsUseCase(categoriesRepository);
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
