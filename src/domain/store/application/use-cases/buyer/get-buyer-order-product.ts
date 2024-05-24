import { Either, left, right } from "src/core/either";
import { ProductRepository } from "../../repositories/product-repository";
import { Product } from "src/domain/store/enterprise/entities/product";
import { NoProductsOrderedByBuyerError } from "../errors/no-products-ordered-by-buyer-error";

interface GetBuyerOrderProductUseCaseRequest {
  buyerId: string;
  page: number;
}

type GetBuyerOrderProductUseCaseResponse = Either<
  NoProductsOrderedByBuyerError,
  {
    products: Product[];
  }
>;

export class GetBuyerOrderProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute({
    buyerId,
    page,
  }: GetBuyerOrderProductUseCaseRequest): Promise<GetBuyerOrderProductUseCaseResponse> {
    const products = await this.productRepository.findByBuyerId(buyerId, page);

    if (!products) {
      return left(new NoProductsOrderedByBuyerError());
    }

    return right({ products });
  }
}
