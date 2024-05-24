import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { makeCategory } from "test/factories/make-category";
import { makeProduct } from "test/factories/make-product";
import { InMemoryCategoriesRepository } from "test/repositories/in-memory-categories-repository";
import { UpdateProductUseCase } from "./update-product";
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository";

let productsRepository: InMemoryProductsRepository;
let categoryRepository: InMemoryCategoriesRepository;
let orderRepository: InMemoryOrdersRepository;
let sut: UpdateProductUseCase;

describe("Create Product", () => {
  beforeEach(() => {
    orderRepository = new InMemoryOrdersRepository(productsRepository);

    productsRepository = new InMemoryProductsRepository(orderRepository);

    categoryRepository = new InMemoryCategoriesRepository();

    sut = new UpdateProductUseCase(productsRepository);
  });

  test("should be able to update a product", async () => {
    const category = makeCategory(
      { title: "category title for product 01" },
      new UniqueEntityID("category-id-01"),
    );

    await categoryRepository.create(category);

    const product = makeProduct({
      categoryId: category.id,
      title: "product register 01",
      description: "description for product",
      price: 200,
    });

    await productsRepository.create(product);

    const result = await sut.execute({
      id: product.id.toString(),
      title: "product register 01 updated",
      description: "description for product updated",
      price: 150,
      imgUrlList: product.imgUrlList,
      stockQuantity: product.stockQuantity,
      minimumQuantityStock: product.minimumQuantityStock,
      discountPercentage: product.discountPercentage,
      width: product.width,
      height: product.height,
      weight: product.weight,
      corsList: product.corsList,
      placeOfSale: product.placeOfSale,
    });

    expect(result.isRight()).toBe(true);

    expect(productsRepository.items[0]).toEqual(
      expect.objectContaining({
        title: "product register 01 updated",
        description: "description for product updated",
        price: 150,
      }),
    );
  });
});
