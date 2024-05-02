import { Either, left, right } from "src/core/either";
import { Product } from "../../../enterprise/entities/product";
import { ProductRepository } from "../../repositories/product-repository";
import { ProductNotFoundError } from "../errors/product-not-found-error";

interface GetProductDetailsUseCaseRequest {
  productId: string;
}

type GetProductDetailsUseCaseResponse = Either<
  ProductNotFoundError,
  {
    product: Product;
  }
>;

export class GetProductDetailsUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute({
    productId,
  }: GetProductDetailsUseCaseRequest): Promise<GetProductDetailsUseCaseResponse> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      return left(new ProductNotFoundError());
    }

    return right({ product });
  }
}
