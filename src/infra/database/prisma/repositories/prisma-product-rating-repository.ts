import { QuantityOfProducts } from "src/core/constants/quantity-of-products";
import { ProductRatingRepository } from "src/domain/store/application/repositories/product-rating-repository";
import { Product } from "src/domain/store/enterprise/entities/product";
import { PrismaProductMapper } from "../mappers/prisma-product-mapper";
import { prisma } from "../prisma";
import { CacheRepository } from "src/infra/cache/cache-repository";
import { CacheKeysPrefix } from "src/core/constants/cache-keys-prefix";

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

    await this.cacheRepository.delete(`${CacheKeysPrefix.PRODUCT}:${id}`);
    await this.cacheRepository.deleteCacheByPattern(
      `${CacheKeysPrefix.PRODUCTS_LIST}:*`,
    );
  }

  async findManyByDiscountPercentage(page: number): Promise<Product[] | null> {
    const cacheKey = `${CacheKeysPrefix.PRODUCTS_LIST}:byDiscountPercentage:${page}`;

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
    const cacheKey = `${CacheKeysPrefix.PRODUCTS_LIST}:byStars:${page}`;

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
