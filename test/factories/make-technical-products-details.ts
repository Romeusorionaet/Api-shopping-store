import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import {
  TechnicalProductDetails,
  TechnicalProductDetailsProps,
} from "src/domain/store/enterprise/entities/technical-product-details";
import { prisma } from "src/infra/database/prisma/prisma";
import { PrismaTechnicalProductDetailsMapper } from "src/infra/database/prisma/mappers/prisma-technical-product-details-mapper";

export function makeTechnicalProductDetails(
  override: Partial<TechnicalProductDetailsProps> = {},
  id?: UniqueEntityID,
) {
  const product = TechnicalProductDetails.create(
    {
      productId: new UniqueEntityID(),
      width: "7,40 cm",
      height: "16,00 cm",
      weight: "166,00 g",
      brand: "Xiaomi",
      model: "Redmi note 7",
      ram: "4 GB",
      rom: "64 GB",
      averageBatteryLife: "22,5 Horas",
      batteryCapacity: "5000 Milliamp Hours",
      operatingSystem: "Android",
      processorBrand: "mediatek",
      screenOrWatchFace: "LCD",
      videoCaptureResolution: "1080p",
      videoResolution: "8 Pixels",
      ...override,
    },
    id,
  );

  return product;
}

export class TechnicalProductDetailsFactory {
  async makePrismaTechnicalProductDetails(
    data: Partial<TechnicalProductDetailsProps> = {},
  ): Promise<TechnicalProductDetails> {
    const technicalProductDetails = makeTechnicalProductDetails(data);

    await prisma.technicalProductDetails.create({
      data: PrismaTechnicalProductDetailsMapper.toPrisma(
        technicalProductDetails,
      ),
    });

    return technicalProductDetails;
  }
}
