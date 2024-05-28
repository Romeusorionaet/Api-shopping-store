import { Either, left, right } from "src/core/either";
import { Product } from "../../../enterprise/entities/product";
import { ProductRepository } from "../../repositories/product-repository";
import { ProductNotFoundError } from "../errors/product-not-found-error";

interface FetchProductsByCategoryUseCaseRequest {
  categoryId: string;
  page: number;
}

type FetchProductsByCategoryUseCaseResponse = Either<
  ProductNotFoundError,
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
      return left(new ProductNotFoundError());
    }

    return right({ products });
  }
}
