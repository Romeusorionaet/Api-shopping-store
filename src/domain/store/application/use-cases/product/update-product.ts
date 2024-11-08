import { Either, left, right } from "src/core/either";
import { Product } from "../../../enterprise/entities/product";
import { ProductRepository } from "../../repositories/product-repository";
import { ModeOfSale } from "src/core/entities/mode-of-sale";
import { ProductNotFoundError } from "../errors/product-not-found-error";
import { TechnicalProductNotFoundError } from "../errors/technical-product-details-not-found-error";
import { TechnicalProductDetailsRepository } from "../../repositories/technical-product-details-repository";

interface UpdateProductUseCaseRequest {
  id: string;
  title: string;
  description: string;
  price: number;
  imgUrlList: string[];
  corsList: string[];
  stockQuantity: number;
  minimumQuantityStock: number;
  discountPercentage: number;
  placeOfSale: ModeOfSale;
  technicalProductId: string;
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

type UpdateProductUseCaseResponse = Either<
  ProductNotFoundError | TechnicalProductNotFoundError,
  {
    productUpdated: Product;
  }
>;

export class UpdateProductUseCase {
  constructor(
    private productRepository: ProductRepository,
    private technicalProductDetailsRepository: TechnicalProductDetailsRepository,
  ) {}

  async execute({
    id,
    title,
    description,
    price,
    imgUrlList,
    corsList,
    stockQuantity,
    minimumQuantityStock,
    discountPercentage,
    placeOfSale,
    technicalProductId,
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
  }: UpdateProductUseCaseRequest): Promise<UpdateProductUseCaseResponse> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      return left(new ProductNotFoundError(title));
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
      placeOfSale,
    });

    const technicalProductDetails =
      await this.technicalProductDetailsRepository.findById(technicalProductId);

    if (!technicalProductDetails) {
      return left(new TechnicalProductNotFoundError());
    }

    const technicalProductDetailsUpdated = technicalProductDetails.update({
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

    await this.technicalProductDetailsRepository.update(
      technicalProductDetailsUpdated,
    );

    await this.productRepository.update(productUpdated);

    return right({ productUpdated });
  }
}
