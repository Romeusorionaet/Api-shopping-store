import { Either, right } from "src/core/either";
import { Product } from "../../enterprise/entities/product";
import { ProductRepository } from "../repositories/product-repository";

interface FetchProductsUseCaseRequest {
  query: string;
  page: number;
}

type FetchProductsUseCaseResponse = Either<
  null,
  {
    products: Product[];
  }
>;

export class FetchProductsUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute({
    query,
    page,
  }: FetchProductsUseCaseRequest): Promise<FetchProductsUseCaseResponse> {
    const products = await this.productRepository.searchMany(query, page);

    return right({ products });
  }
}
