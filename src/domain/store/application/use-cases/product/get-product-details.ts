import { Either, left, right } from "src/core/either";
import { Product } from "../../../enterprise/entities/product";
import { ProductRepository } from "../../repositories/product-repository";
import { ProductNotFoundError } from "../errors/product-not-found-error";
import { TechnicalProductNotFoundError } from "../errors/technical-product-details-not-found-error";
import { TechnicalProductDetails } from "src/domain/store/enterprise/entities/technical-product-details";
import { TechnicalProductDetailsRepository } from "../../repositories/technical-product-details-repository";

interface GetProductDetailsUseCaseRequest {
  productId: string;
}

type GetProductDetailsUseCaseResponse = Either<
  ProductNotFoundError | TechnicalProductNotFoundError,
  {
    product: Product;
    technicalProductDetails: TechnicalProductDetails;
  }
>;

export class GetProductDetailsUseCase {
  constructor(
    private productRepository: ProductRepository,
    private technicalProductDetailsRepository: TechnicalProductDetailsRepository,
  ) {}

  async execute({
    productId,
  }: GetProductDetailsUseCaseRequest): Promise<GetProductDetailsUseCaseResponse> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      return left(new ProductNotFoundError(""));
    }

    const technicalProductDetails =
      await this.technicalProductDetailsRepository.findByProductId(productId);

    if (!technicalProductDetails) {
      return left(new TechnicalProductNotFoundError());
    }

    return right({ product, technicalProductDetails });
  }
}
