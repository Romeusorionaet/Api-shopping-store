import { QuantityOfProducts } from "src/domain/store/application/constants/quantity-of-products";
import { ProductRatingRepository } from "src/domain/store/application/repositories/product-rating-repository";
import { Product } from "src/domain/store/enterprise/entities/product";
import { PrismaProductMapper } from "../mappers/prisma-product-mapper";
import { prisma } from "../prisma";

export class PrismaProductRatingRepository implements ProductRatingRepository {
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
  }

  async findManyByDiscountPercentage(page: number): Promise<Product[] | null> {
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

    return products.map(PrismaProductMapper.toDomain);
  }

  async findManyByStars(page: number): Promise<Product[] | null> {
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

    return products.map(PrismaProductMapper.toDomain);
  }
}
