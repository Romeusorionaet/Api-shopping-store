import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { Entity } from "src/core/entities/entity";

export interface TechnicalProductDetailsProps {
  productId: UniqueEntityID;
  width: number;
  height: number;
  weight: number;
  brand: string;
  model: string;
  ram: number;
  rom: number;
  videoResolution: string;
  batteryCapacity: string;
  screenOrWatchFace: string;
  averageBatteryLife: string;
  videoCaptureResolution: string;
  processorBrand: string;
  operatingSystem: string;
}

export class TechnicalProductDetails extends Entity<TechnicalProductDetailsProps> {
  get productId() {
    return this.props.productId;
  }

  get width() {
    return this.props.width;
  }

  get height() {
    return this.props.height;
  }

  get weight() {
    return this.props.weight;
  }

  get brand() {
    return this.props.brand;
  }

  get model() {
    return this.props.model;
  }

  get ram() {
    return this.props.ram;
  }

  get rom() {
    return this.props.rom;
  }

  get videoResolution() {
    return this.props.videoResolution;
  }

  get batteryCapacity() {
    return this.props.batteryCapacity;
  }

  get screenOrWatchFace() {
    return this.props.screenOrWatchFace;
  }

  get averageBatteryLife() {
    return this.props.averageBatteryLife;
  }

  get videoCaptureResolution() {
    return this.props.videoCaptureResolution;
  }

  get processorBrand() {
    return this.props.processorBrand;
  }

  get operatingSystem() {
    return this.props.operatingSystem;
  }

  static create(props: TechnicalProductDetailsProps, id?: UniqueEntityID) {
    const product = new TechnicalProductDetails(
      {
        ...props,
      },
      id,
    );
    return product;
  }

  update(
    props: Partial<TechnicalProductDetailsProps>,
  ): TechnicalProductDetails {
    return new TechnicalProductDetails(
      {
        ...this.props,
        ...props,
      },
      this.id,
    );
  }
}
