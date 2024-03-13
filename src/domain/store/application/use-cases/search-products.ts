import { Either, left, right } from "src/core/either";
import { Product } from "../../enterprise/entities/product";
import { ProductRepository } from "../repositories/product-repository";
import { ResourceNotFoundError } from "src/core/errors/resource-not-found-error";

interface SearchProductsUseCaseRequest {
  query: string;
  page: number;
}

type SearchProductsUseCaseResponse = Either<
  ResourceNotFoundError,
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
      return left(new ResourceNotFoundError());
    }

    return right({ products });
  }
}
