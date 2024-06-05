import { TechnicalProductDetailsRepository } from "src/domain/store/application/repositories/technical-product-details-repository";
import { TechnicalProductNotFoundError } from "src/domain/store/application/use-cases/errors/technical-product-details-not-found-error";
import { TechnicalProductDetails } from "src/domain/store/enterprise/entities/technical-product-details";

export class InMemoryTechnicalProductDetailsRepository
  implements TechnicalProductDetailsRepository
{
  public items: TechnicalProductDetails[] = [];

  async create(data: TechnicalProductDetails): Promise<void> {
    this.items.push(data);
  }

  async findById(id: string): Promise<TechnicalProductDetails | null> {
    const technicalProductDetails = this.items.find(
      (item) => item.id?.toString() === id,
    );

    if (!technicalProductDetails) {
      return null;
    }

    return technicalProductDetails;
  }

  async findByProductId(id: string): Promise<TechnicalProductDetails | null> {
    const existingTechnicalProductDetails = this.items.find(
      (item) => item.productId.toString() === id,
    );

    if (!existingTechnicalProductDetails) {
      return null;
    }

    return existingTechnicalProductDetails;
  }

  async update(data: TechnicalProductDetails): Promise<void> {
    const existingTechnicalProductDetails = this.items.find(
      (item) => item.id === data.id,
    );

    if (existingTechnicalProductDetails) {
      Object.assign(existingTechnicalProductDetails, data);
    } else {
      throw new TechnicalProductNotFoundError();
    }
  }
}
