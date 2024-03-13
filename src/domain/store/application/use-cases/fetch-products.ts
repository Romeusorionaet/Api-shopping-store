import { Either, right } from "src/core/either";
import { Product } from "../../enterprise/entities/product";
import { ProductRepository } from "../repositories/product-repository";

interface FetchProductsUseCaseRequest {
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
    page,
  }: FetchProductsUseCaseRequest): Promise<FetchProductsUseCaseResponse> {
    const products = await this.productRepository.findMany({ page });

    return right({ products });
  }
}
