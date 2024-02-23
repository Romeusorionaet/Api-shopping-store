import { Either, left, right } from "src/core/either";
import { ProductProps } from "../../enterprise/entities/product";
import { ResourceNotFoundError } from "src/core/errors/resource-not-found-error";
import { ProductRepository } from "../repositories/product-repository";

interface GetProductDetailsUseCaseRequest {
  productId: string;
}

type GetProductDetailsUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    product: ProductProps;
  }
>;

export class GetProductDetailsUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute({
    productId,
  }: GetProductDetailsUseCaseRequest): Promise<GetProductDetailsUseCaseResponse> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      return left(new ResourceNotFoundError());
    }

    return right({ product });
  }
}
