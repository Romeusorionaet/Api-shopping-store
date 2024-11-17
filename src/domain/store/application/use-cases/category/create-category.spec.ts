import { InMemoryCategoriesRepository } from "test/repositories/in-memory-categories-repository";
import { CreateCategoryUseCase } from "./create-category";
import { makeCategory } from "test/factories/make-category";
import { CategoryAlreadyExistsError } from "../errors/category-already-exists-error";
import { InMemoryProductDataStoreRepository } from "test/repositories/in-memory-product-data-store-repository";

let categoriesRepository: InMemoryCategoriesRepository;
let dataStore: InMemoryProductDataStoreRepository;
let sut: CreateCategoryUseCase;

describe("Create Category", () => {
  beforeEach(() => {
    dataStore = new InMemoryProductDataStoreRepository();
    categoriesRepository = new InMemoryCategoriesRepository(dataStore);
    sut = new CreateCategoryUseCase(categoriesRepository);
  });

  test("should be able create a category", async () => {
    const category = makeCategory({ title: "First category test" });

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
