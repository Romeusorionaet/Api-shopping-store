import { Either, left, right } from "src/core/either";
import { Product } from "../../../enterprise/entities/product";
import { ProductRepository } from "../../repositories/product-repository";
import { ProductNotFoundError } from "../errors/product-not-found-error";

interface SearchProductsUseCaseRequest {
  query: string;
  page: number;
}

type SearchProductsUseCaseResponse = Either<
  ProductNotFoundError,
  {
    products: Product[];
  }
>;

export class SearchProductsUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute({
    query,
    page,
  }: SearchProductsUseCaseRequest): Promise<SearchProductsUseCaseResponse> {
    const products = await this.productRepository.searchMany(query, page);

    if (!products) {
      return left(new ProductNotFoundError());
    }

    return right({ products });
  }
}
