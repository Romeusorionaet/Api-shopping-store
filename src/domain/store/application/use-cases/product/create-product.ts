import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { ProductRepository } from "../../../../store/application/repositories/product-repository";
import { Product } from "../../../enterprise/entities/product";
import { Either, left, right } from "src/core/either";
import { ModeOfSale } from "src/core/entities/mode-of-sale";
import { ProductAlreadyExistsError } from "../errors/product-already-exists-error";
import { CategoryRepository } from "../../repositories/category-repository";
import { TheAssignedCategoryDoesNotExistError } from "../errors/the-assigned-category-does-not-exist-error";

interface CreateProductUseCaseRequest {
  categoryId: string;
  categoryTitle: string;
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
  stars?: number | null;
}

type CreateProductUseCaseResponse = Either<
  ProductAlreadyExistsError | TheAssignedCategoryDoesNotExistError,
  { product: Product }
>;

export class CreateProductUseCase {
  constructor(
    private productRepository: ProductRepository,
    private categoryRepository: CategoryRepository,
  ) {}

  async execute({
    categoryId,
    categoryTitle,
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
    stars,
  }: CreateProductUseCaseRequest): Promise<CreateProductUseCaseResponse> {
    const existProduct = await this.productRepository.findByTitle(title);

    const existCategory = await this.categoryRepository.findById(categoryId);

    if (!existCategory) {
      return left(new TheAssignedCategoryDoesNotExistError());
    }

    if (existProduct) {
      return left(new ProductAlreadyExistsError(existProduct.title));
    }

    const product = Product.create({
      categoryId: new UniqueEntityID(categoryId),
      categoryTitle,
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
      stars,
    });

    await this.productRepository.create(product);

    return right({ product });
  }
}
