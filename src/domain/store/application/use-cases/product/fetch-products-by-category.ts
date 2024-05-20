import { Either, left, right } from "src/core/either";
import { Product } from "../../../enterprise/entities/product";
import { ProductRepository } from "../../repositories/product-repository";
import { ProductNotFoundError } from "../errors/product-not-found-error";

interface FetchProductsByCategoryUseCaseRequest {
  slug: string;
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
    slug,
    page,
  }: FetchProductsByCategoryUseCaseRequest): Promise<FetchProductsByCategoryUseCaseResponse> {
    const products = await this.productRepository.findManyByCategoryTitle(
      slug,
      page,
    );

    if (!products) {
      return left(new ProductNotFoundError());
    }

    return right({ products });
  }
}
