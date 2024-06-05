import { TechnicalProductDetails } from "../../enterprise/entities/technical-product-details";

export interface TechnicalProductDetailsRepository {
  create(data: TechnicalProductDetails): Promise<void>;
  update(data: TechnicalProductDetails): Promise<void>;
  findById(id: string): Promise<TechnicalProductDetails | null>;
  findByProductId(id: string): Promise<TechnicalProductDetails | null>;
}
