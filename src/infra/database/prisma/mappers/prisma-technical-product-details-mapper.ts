import {
  Prisma,
  TechnicalProductDetails as PrismaTechnicalProductDetails,
} from "@prisma/client";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { TechnicalProductDetails } from "src/domain/store/enterprise/entities/technical-product-details";

export class PrismaTechnicalProductDetailsMapper {
  static toDomain(raw: PrismaTechnicalProductDetails): TechnicalProductDetails {
    return TechnicalProductDetails.create(
      {
        productId: new UniqueEntityID(raw.productId),
        width: raw.width,
        height: raw.height,
        weight: raw.weight,
        brand: raw.brand,
        model: raw.model,
        ram: raw.ram,
        rom: raw.rom,
        averageBatteryLife: raw.averageBatteryLife,
        batteryCapacity: raw.batteryCapacity,
        operatingSystem: raw.operatingSystem,
        processorBrand: raw.processorBrand,
        screenOrWatchFace: raw.screenOrWatchFace,
        videoCaptureResolution: raw.videoCaptureResolution,
        videoResolution: raw.videoResolution,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(
    technicalProductDetails: TechnicalProductDetails,
  ): Prisma.TechnicalProductDetailsUncheckedCreateInput {
    return {
      id: technicalProductDetails.id.toString(),
      productId: technicalProductDetails.productId.toString(),
      brand: technicalProductDetails.brand,
      height: technicalProductDetails.height,
      model: technicalProductDetails.model,
      weight: technicalProductDetails.weight,
      width: technicalProductDetails.width,
      ram: technicalProductDetails.ram,
      rom: technicalProductDetails.rom,
      averageBatteryLife: technicalProductDetails.averageBatteryLife,
      batteryCapacity: technicalProductDetails.batteryCapacity,
      operatingSystem: technicalProductDetails.operatingSystem,
      processorBrand: technicalProductDetails.processorBrand,
      screenOrWatchFace: technicalProductDetails.screenOrWatchFace,
      videoCaptureResolution: technicalProductDetails.videoCaptureResolution,
      videoResolution: technicalProductDetails.videoResolution,
    };
  }
}
