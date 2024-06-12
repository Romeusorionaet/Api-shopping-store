import { ProductRepository } from "src/domain/store/application/repositories/product-repository";
import { Product } from "src/domain/store/enterprise/entities/product";
import { prisma } from "../prisma";
import { PrismaProductMapper } from "../mappers/prisma-product-mapper";
import { PaginationParams } from "src/core/repositories/pagination-params";
import { OrderProduct } from "src/domain/store/enterprise/entities/order-product";
import { QuantityOfProducts } from "src/domain/store/application/constants/quantity-of-products";
import { CacheRepository } from "src/infra/cache/cache-repository";

export class PrismaProductRepository implements ProductRepository {
  constructor(private cacheRepository: CacheRepository) {}

  async create(product: Product): Promise<void> {
    const data = PrismaProductMapper.toPrisma(product);

    await prisma.product.create({
      data,
    });

    await this.cacheRepository.deleteCacheByPattern("products:*");
  }

  async findMany({ page }: PaginationParams): Promise<Product[]> {
    const cacheKey = `products:allProducts:${page}`;

    const cacheHit = await this.cacheRepository.get(cacheKey);

    if (cacheHit) {
      const cacheData = JSON.parse(cacheHit);

      return cacheData.map(PrismaProductMapper.toDomain);
    }

    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * QuantityOfProducts.PER_PAGE,
      take: QuantityOfProducts.PER_PAGE,
    });

    const productsMapped = products.map(PrismaProductMapper.toDomain);

    await this.cacheRepository.set(cacheKey, JSON.stringify(products));

    return productsMapped;
  }

  async findById(id: string): Promise<Product | null> {
    const cacheKey = `product:unique:${id}`;

    const cacheHit = await this.cacheRepository.get(cacheKey);

    if (cacheHit) {
      const cacheData = JSON.parse(cacheHit);

      return PrismaProductMapper.toDomain(cacheData);
    }

    const product = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!product) {
      return null;
    }

    const productMapped = PrismaProductMapper.toDomain(product);

    await this.cacheRepository.set(cacheKey, JSON.stringify(product));

    return productMapped;
  }

  async findByTitle(title: string): Promise<Product | null> {
    const product = await prisma.product.findUnique({
      where: {
        title,
      },
    });

    if (!product) {
      return null;
    }

    return PrismaProductMapper.toDomain(product);
  }

  async findManyByCategoryId(
    id: string,
    page: number,
  ): Promise<Product[] | null> {
    const cacheKey = `products:category:${id}:${page}`;

    const cacheHit = await this.cacheRepository.get(cacheKey);

    if (cacheHit) {
      const cacheData = JSON.parse(cacheHit);
      return cacheData.map(PrismaProductMapper.toDomain);
    }

    const products = await prisma.product.findMany({
      where: {
        categoryId: id,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * QuantityOfProducts.PER_PAGE,
      take: QuantityOfProducts.PER_PAGE,
    });

    if (!products) {
      return null;
    }

    const productsMapped = products.map(PrismaProductMapper.toDomain);

    await this.cacheRepository.set(cacheKey, JSON.stringify(products));

    return productsMapped;
  }

  async searchMany(query: string, page: number): Promise<Product[] | null> {
    const cacheKey = `products:search:${query}:${page}`;
    const cacheHit = await this.cacheRepository.get(cacheKey);

    if (cacheHit) {
      const cacheData = JSON.parse(cacheHit);
      return cacheData.map(PrismaProductMapper.toDomain);
    }

    const queryWords = query.toLowerCase().split(" ");

    const products = await prisma.product.findMany({
      where: {
        OR: queryWords.flatMap((word) => [
          {
            title: {
              contains: word,
              mode: "insensitive",
            },
          },
          {
            categoryTitle: {
              contains: word,
              mode: "insensitive",
            },
          },
        ]),
      },
      skip: (page - 1) * QuantityOfProducts.PER_PAGE,
      take: QuantityOfProducts.PER_PAGE,
    });

    if (!products) {
      return null;
    }

    const productsMapped = products.map(PrismaProductMapper.toDomain);

    await this.cacheRepository.set(cacheKey, JSON.stringify(products));

    return productsMapped;
  }

  async update(data: Product): Promise<void> {
    const product = PrismaProductMapper.toPrisma(data);

    await prisma.product.update({
      where: {
        id: product.id,
      },
      data: product,
    });

    await this.cacheRepository.delete(`product:${product.id}`);

    await this.cacheRepository.deleteCacheByPattern("products:*");
  }

  async decrementStockQuantity(orderProducts: OrderProduct[]): Promise<void> {
    for (const productSold of orderProducts) {
      const title = productSold.title;
      const quantitySold = productSold.quantity;

      await prisma.product.update({
        where: {
          title,
        },
        data: {
          stockQuantity: {
            decrement: quantitySold,
          },
        },
      });

      await this.cacheRepository.delete(`product:${productSold.id}`);
    }

    await this.cacheRepository.deleteCacheByPattern("products:*");
  }
}
