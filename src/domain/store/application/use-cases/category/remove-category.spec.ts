import { InMemoryCategoriesRepository } from "test/repositories/in-memory-categories-repository";
import { makeCategory } from "test/factories/make-category";
import { RemoveCategoryUseCase } from "./remove-category";

let categoriesRepository: InMemoryCategoriesRepository;
let sut: RemoveCategoryUseCase;

describe("Remove Category", () => {
  beforeEach(() => {
    categoriesRepository = new InMemoryCategoriesRepository();
    sut = new RemoveCategoryUseCase(categoriesRepository);
  });

  test("should be able to remove category", async () => {
    const category = makeCategory({});

    await categoriesRepository.create(category);

    const result = await sut.execute({ id: category.id.toString() });

    expect(result.isRight()).toBe(true);
    expect(categoriesRepository.items).toHaveLength(0);
  });
});
