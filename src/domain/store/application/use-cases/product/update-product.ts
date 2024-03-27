import { Either, left, right } from "src/core/either";
import { Product } from "../../../enterprise/entities/product";
import { ResourceNotFoundError } from "src/core/errors/resource-not-found-error";
import { ProductRepository } from "../../repositories/product-repository";
import { ModeOfSale } from "src/core/entities/mode-of-sale";

interface UpdateProductUseCaseRequest {
  productId: string;
  title: string;
  description: string;
  price: number;
  imgUrlList: string[];
  corsList: string[];
  stockQuantity: number;
  minimumQuantityStock: number;
  discountPercentage: number;
  width: number;
  height: number;
  weight: number;
  placeOfSale?: ModeOfSale;
}

type UpdateProductUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    productUpdated: Product;
  }
>;

export class UpdateProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute({
    productId,
    title,
    description,
    price,
    imgUrlList,
    corsList,
    stockQuantity,
    minimumQuantityStock,
    discountPercentage,
    width,
    height,
    weight,
    placeOfSale,
  }: UpdateProductUseCaseRequest): Promise<UpdateProductUseCaseResponse> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      return left(new ResourceNotFoundError());
    }

    const productUpdated = product.update({
      title,
      description,
      price,
      imgUrlList,
      corsList,
      stockQuantity,
      minimumQuantityStock,
      discountPercentage,
      width,
      height,
      weight,
      placeOfSale,
    });

    await this.productRepository.update(productUpdated);

    return right({ productUpdated });
  }
}