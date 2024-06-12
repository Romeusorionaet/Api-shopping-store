import { QuantityOfProducts } from "src/domain/store/application/constants/quantity-of-products";
import { ProductRatingRepository } from "src/domain/store/application/repositories/product-rating-repository";
import { Product } from "src/domain/store/enterprise/entities/product";
import { PrismaProductMapper } from "../mappers/prisma-product-mapper";
import { prisma } from "../prisma";
import { CacheRepository } from "src/infra/cache/cache-repository";

export class PrismaProductRatingRepository implements ProductRatingRepository {
  constructor(private cacheRepository: CacheRepository) {}

  async addStarToProduct(id: string): Promise<void> {
    await prisma.product.update({
      where: {
        id,
      },
      data: {
        stars: {
          increment: 1,
        },
      },
    });

    await this.cacheRepository.delete(`product:${id}`);
    await this.cacheRepository.deleteCacheByPattern("products:*");
  }

  async findManyByDiscountPercentage(page: number): Promise<Product[] | null> {
    const cacheKey = `products:byDiscountPercentage:${page}`;

    const cacheHit = await this.cacheRepository.get(cacheKey);

    if (cacheHit) {
      const cacheData = JSON.parse(cacheHit);

      return cacheData.map(PrismaProductMapper.toDomain);
    }

    const products = await prisma.product.findMany({
      where: {
        discountPercentage: {
          gt: 0,
        },
      },
      skip: (page - 1) * QuantityOfProducts.PER_PAGE,
      take: QuantityOfProducts.PER_PAGE,
    });

    if (!products) {
      return null;
    }

    await this.cacheRepository.set(cacheKey, JSON.stringify(products));

    return products.map(PrismaProductMapper.toDomain);
  }

  async findManyByStars(page: number): Promise<Product[] | null> {
    const cacheKey = `products:byStars:${page}`;

    const cacheHit = await this.cacheRepository.get(cacheKey);

    if (cacheHit) {
      const cacheData = JSON.parse(cacheHit);

      return cacheData.map(PrismaProductMapper.toDomain);
    }

    const products = await prisma.product.findMany({
      where: {
        stars: {
          gt: 0,
        },
      },
      skip: (page - 1) * QuantityOfProducts.PER_PAGE,
      take: QuantityOfProducts.PER_PAGE,
    });

    if (!products) {
      return null;
    }

    await this.cacheRepository.set(cacheKey, JSON.stringify(products));

    return products.map(PrismaProductMapper.toDomain);
  }
}
