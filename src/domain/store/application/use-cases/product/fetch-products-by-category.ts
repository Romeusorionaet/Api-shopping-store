import { Either, left, right } from "src/core/either";
import { Product } from "../../../enterprise/entities/product";
import { ProductRepository } from "../../repositories/product-repository";
import { ProductsNotFoundForThisCategoryError } from "../errors/products-not-found-for-this-category-error";

interface FetchProductsByCategoryUseCaseRequest {
  categoryId: string;
  page: number;
}

type FetchProductsByCategoryUseCaseResponse = Either<
  ProductsNotFoundForThisCategoryError,
  {
    products: Product[];
  }
>;

export class FetchProductsByCategoryUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute({
    categoryId,
    page,
  }: FetchProductsByCategoryUseCaseRequest): Promise<FetchProductsByCategoryUseCaseResponse> {
    const products = await this.productRepository.findManyByCategoryId(
      categoryId,
      page,
    );

    if (!products) {
      return left(new ProductsNotFoundForThisCategoryError());
    }

    return right({ products });
  }
}
