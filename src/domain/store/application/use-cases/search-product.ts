import { Either, left, right } from "src/core/either";
import { ProductProps } from "../../enterprise/entities/product";
import { ProductRepository } from "../repositories/product-repository";
import { ResourceNotFoundError } from "src/core/errors/resource-not-found-error";

interface SearchProductUseCaseRequest {
  query: string;
  page: number;
}

type SearchProductUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    product: ProductProps[];
  }
>;

export class SearchProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute({
    query,
    page,
  }: SearchProductUseCaseRequest): Promise<SearchProductUseCaseResponse> {
    const product = await this.productRepository.searchMany(query, page);

    const itHasNoProduct = product.length === 0;

    if (itHasNoProduct) {
      return left(new ResourceNotFoundError());
    }

    return right({
      product,
    });
  }
}
