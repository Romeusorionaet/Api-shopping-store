import { TechnicalProductDetails } from "src/domain/store/enterprise/entities/technical-product-details";

export class TechnicalProductDetailsPresenter {
  static toHTTP(technicalProductDetails: TechnicalProductDetails) {
    return {
      id: technicalProductDetails.id.toString(),
      productId: technicalProductDetails.productId.toString(),
      width: technicalProductDetails.width,
      height: technicalProductDetails.height,
      weight: technicalProductDetails.weight,
      brand: technicalProductDetails.brand,
      model: technicalProductDetails.model,
      ram: technicalProductDetails.ram,
      rom: technicalProductDetails.rom,
      averageBatteryLife: technicalProductDetails.averageBatteryLife,
      batteryCapacity: technicalProductDetails.averageBatteryLife,
      operatingSystem: technicalProductDetails.operatingSystem,
      processorBrand: technicalProductDetails.processorBrand,
      screenOrWatchFace: technicalProductDetails.screenOrWatchFace,
      videoCaptureResolution: technicalProductDetails.videoCaptureResolution,
      videoResolution: technicalProductDetails.videoResolution,
    };
  }
}
