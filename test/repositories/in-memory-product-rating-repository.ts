import { ProductRatingRepository } from "src/domain/store/application/repositories/product-rating-repository";
import { Product } from "src/domain/store/enterprise/entities/product";
import { InMemoryProductDataStoreRepository } from "./in-memory-product-data-store-repository";

export class InMemoryProductRatingRepository
  implements ProductRatingRepository
{
  constructor(private dataStore: InMemoryProductDataStoreRepository) {}

  async addStarToProduct(id: string): Promise<void> {
    const product = this.dataStore.items.find(
      (item) => item.id.toString() === id,
    );

    if (product && product.stars) {
      product.stars += 1;
    }
  }

  async findManyByDiscountPercentage(page: number): Promise<Product[] | null> {
    const products = this.dataStore.items
      .filter((item) => item.discountPercentage > 0)
      .slice((page - 1) * 20, page * 20);

    if (!products) {
      return null;
    }

    return products;
  }

  async findManyByStars(page: number): Promise<Product[] | null> {
    const products = this.dataStore.items
      .filter((item) => item.stars! > 0)
      .slice((page - 1) * 20, page * 20);

    if (!products) {
      return null;
    }

    return products;
  }
}
