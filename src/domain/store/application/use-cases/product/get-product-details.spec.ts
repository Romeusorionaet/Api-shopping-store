import { GetProductDetailsUseCase } from "./get-product-details";
import { InMemoryProductsRepository } from "test/repositories/in-memory-products-repository";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { makeProduct } from "test/factories/make-product";
import { InMemoryOrdersRepository } from "test/repositories/in-memory-orders-repository";
import { makeTechnicalProductDetails } from "test/factories/make-technical-products-details";

let productsRepository: InMemoryProductsRepository;
let orderRepository: InMemoryOrdersRepository;
let sut: GetProductDetailsUseCase;

describe("Get Product Details", () => {
  beforeEach(() => {
    orderRepository = new InMemoryOrdersRepository(productsRepository);

    productsRepository = new InMemoryProductsRepository(orderRepository);

    orderRepository = new InMemoryOrdersRepository(productsRepository);

    sut = new GetProductDetailsUseCase(productsRepository);
  });

  test("should be able to get product details", async () => {
    const product = makeProduct(
      {
        categoryId: new UniqueEntityID("first-category-id"),
        title: "my product",
      },
      new UniqueEntityID("first-product-id"),
    );

    const technicalProductDetails = makeTechnicalProductDetails({
      productId: product.id,
    });

    await productsRepository.create(product);
    await productsRepository.createTechnicalProductDetails(
      technicalProductDetails,
    );

    const result = await sut.execute({ productId: product.id.toString() });

    expect(result.isRight()).toBe(true);
    expect(productsRepository.items).toHaveLength(1);

    if (result.isRight()) {
      expect(result.value.product).toEqual(
        expect.objectContaining({
          id: new UniqueEntityID("first-product-id"),
          categoryId: new UniqueEntityID("first-category-id"),
          title: "my product",
        }),
      );
      expect(result.value.technicalProductDetails).toEqual(
        expect.objectContaining({
          productId: product.id,
        }),
      );
    }
  });
});
