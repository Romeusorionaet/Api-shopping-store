import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { ProductRepository } from "../../../../store/application/repositories/product-repository";
import { Product } from "../../../enterprise/entities/product";
import { Either, left, right } from "src/core/either";
import { ModeOfSale } from "src/core/entities/mode-of-sale";
import { ProductAlreadyExistsError } from "../errors/product-already-exists-error";
import { CategoryRepository } from "../../repositories/category-repository";
import { TheAssignedCategoryDoesNotExistError } from "../errors/the-assigned-category-does-not-exist-error";
import { TechnicalProductDetails } from "src/domain/store/enterprise/entities/technical-product-details";
import { CategoryTitleSentDoesNotMatchError } from "../errors/category-title-sent-does-not-match-error";
import { TechnicalProductDetailsRepository } from "../../repositories/technical-product-details-repository";

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
  placeOfSale: ModeOfSale;
  stars?: number | null;
  technicalProductDetails: {
    width: string;
    height: string;
    weight: string;
    brand: string;
    model: string;
    ram: string;
    rom: string;
    videoResolution: string;
    batteryCapacity: string;
    screenOrWatchFace: string;
    averageBatteryLife: string;
    videoCaptureResolution: string;
    processorBrand: string;
    operatingSystem: string;
  };
}

type CreateProductUseCaseResponse = Either<
  | ProductAlreadyExistsError
  | TheAssignedCategoryDoesNotExistError
  | CategoryTitleSentDoesNotMatchError,
  { product: Product }
>;

export class CreateProductUseCase {
  constructor(
    private productRepository: ProductRepository,
    private categoryRepository: CategoryRepository,
    private technicalProductDetailsRepository: TechnicalProductDetailsRepository,
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
    placeOfSale,
    stars,
    technicalProductDetails: {
      width,
      height,
      weight,
      brand,
      model,
      ram,
      rom,
      videoResolution,
      batteryCapacity,
      screenOrWatchFace,
      averageBatteryLife,
      videoCaptureResolution,
      processorBrand,
      operatingSystem,
    },
  }: CreateProductUseCaseRequest): Promise<CreateProductUseCaseResponse> {
    const existProduct = await this.productRepository.findByTitle(title);

    const existCategory = await this.categoryRepository.findById(categoryId);

    if (!existCategory) {
      return left(new TheAssignedCategoryDoesNotExistError());
    }

    if (existCategory.title !== categoryTitle) {
      return left(new CategoryTitleSentDoesNotMatchError());
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
      placeOfSale,
      stars,
    });

    const technicalProductDetails = TechnicalProductDetails.create({
      productId: product.id,
      width,
      height,
      weight,
      brand,
      model,
      ram,
      rom,
      videoResolution,
      batteryCapacity,
      screenOrWatchFace,
      averageBatteryLife,
      videoCaptureResolution,
      processorBrand,
      operatingSystem,
    });

    await this.productRepository.create(product);
    await this.technicalProductDetailsRepository.create(
      technicalProductDetails,
    );

    return right({ product });
  }
}
