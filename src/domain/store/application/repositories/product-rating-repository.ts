import { Product } from "../../enterprise/entities/product";

export interface ProductRatingRepository {
  addStarToProduct(id: string): Promise<void>;
  findManyByStars(page: number): Promise<Product[] | null>;
  findManyByDiscountPercentage(page: number): Promise<Product[] | null>;
}
