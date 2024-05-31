import { Either, left, right } from "src/core/either";
import { Product } from "../../../enterprise/entities/product";
import { ProductRepository } from "../../repositories/product-repository";
import { ProductNotFoundError } from "../errors/product-not-found-error";
import { TechnicalProductNotFoundError } from "../errors/technical-product-details-not-found-error";
import { TechnicalProductDetails } from "src/domain/store/enterprise/entities/technical-product-details";

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
  constructor(private productRepository: ProductRepository) {}

  async execute({
    productId,
  }: GetProductDetailsUseCaseRequest): Promise<GetProductDetailsUseCaseResponse> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      return left(new ProductNotFoundError());
    }

    const technicalProductDetails =
      await this.productRepository.findTechnicalProductDetailsByProductId(
        productId,
      );

    if (!technicalProductDetails) {
      return left(new TechnicalProductNotFoundError());
    }

    return right({ product, technicalProductDetails });
  }
}
