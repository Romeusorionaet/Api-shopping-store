import { Either, left, right } from "src/core/either";
import { ProductRepository } from "../../repositories/product-repository";
import { ProductNotFoundError } from "../errors/product-not-found-error";

interface RemoveProductUseCaseRequest {
  id: string;
}

type RemoveProductUseCaseResponse = Either<ProductNotFoundError, object>;

export class RemoveProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute({
    id,
  }: RemoveProductUseCaseRequest): Promise<RemoveProductUseCaseResponse> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      return left(new ProductNotFoundError());
    }

    await this.productRepository.remove(id);

    return right({});
  }
}
