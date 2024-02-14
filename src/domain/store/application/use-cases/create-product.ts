import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { ProductRepository } from "../../../store/application/repositories/product-repository";
import { Product } from "../../enterprise/entities/product";
import { Either, right } from "src/core/either";

interface CreateProductUseCaseRequest {
  categoryId: string;
  categoryTitle: string;
  title: string;
  description: string;
  price: number;
  imgUrlList: string[];
  stockQuantity: number;
  minimumQuantityStock: number;
  discountPercentage: number;
  width: number;
  height: number;
  weight: number;
  corsList: string[];
  placeOfSale: string;
  star: number;
}

type CreateProductUseCaseResponse = Either<null, { product: Product }>;

export class CreateProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute({
    categoryId,
    categoryTitle,
    title,
    description,
    price,
    imgUrlList,
    stockQuantity,
    minimumQuantityStock,
    discountPercentage,
    width,
    height,
    weight,
    corsList,
    placeOfSale,
    star,
  }: CreateProductUseCaseRequest): Promise<CreateProductUseCaseResponse> {
    const product = Product.create({
      categoryId: new UniqueEntityID(categoryId),
      categoryTitle,
      title,
      description,
      price,
      imgUrlList,
      stockQuantity,
      minimumQuantityStock,
      discountPercentage,
      width,
      height,
      weight,
      corsList,
      placeOfSale,
      star,
    });

    await this.productRepository.create(product);

    return right({ product });
  }
}
