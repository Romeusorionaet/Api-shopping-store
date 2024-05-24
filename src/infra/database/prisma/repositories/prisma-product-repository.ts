import { ProductRepository } from "src/domain/store/application/repositories/product-repository";
import { Product } from "src/domain/store/enterprise/entities/product";
import { prisma } from "../prisma";
import { PrismaProductMapper } from "../mappers/prisma-product-mapper";
import { PaginationParams } from "src/core/repositories/pagination-params";
import { OrderProduct } from "src/domain/store/enterprise/entities/order-product";

export class PrismaProductRepository implements ProductRepository {
  async decrementStockQuantity(orderProducts: OrderProduct[]): Promise<void> {
    for (const productSold of orderProducts) {
      const productId = productSold.productId;
      const quantitySold = productSold.quantity;

      await prisma.product.update({
        where: {
          id: productId.toString(),
        },
        data: {
          stockQuantity: {
            decrement: quantitySold,
          },
        },
      });
    }
  }

  async create(product: Product): Promise<void> {
    const data = PrismaProductMapper.toPrisma(product);

    await prisma.product.create({
      data,
    });
  }

  async findMany({ page }: PaginationParams): Promise<Product[]> {
    const perPage = 10;

    const products = await prisma.product.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: {
        createdAt: "desc",
      },
    });

    return products.map(PrismaProductMapper.toDomain);
  }

  async findById(id: string): Promise<Product | null> {
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!product) {
      return null;
    }

    return PrismaProductMapper.toDomain(product);
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

  async findManyByCategoryTitle(
    slug: string,
    page: number,
  ): Promise<Product[] | null> {
    const slugWord = slug.replace(/-/g, " ").toLowerCase().split(" ");

    const products = await prisma.product.findMany({
      where: {
        OR: slugWord.map((word) => ({
          categoryTitle: {
            contains: word,
            mode: "insensitive",
          },
        })),
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * 20,
      take: 20,
    });

    if (!products) {
      return null;
    }

    return products.map(PrismaProductMapper.toDomain);
  }

  async findByBuyerId(
    buyerId: string,
    page: number,
  ): Promise<Product[] | null> {
    const products = await prisma.product.findMany({
      where: {
        orderProducts: {
          some: {
            order: {
              buyerId,
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * 20,
      take: 20,
    });

    if (!products) {
      return null;
    }

    return products.map(PrismaProductMapper.toDomain);
  }

  async searchMany(query: string, page: number): Promise<Product[] | null> {
    const queryWords = query.toLowerCase().split(" ");

    const products = await prisma.product.findMany({
      where: {
        OR: queryWords.map((word) => ({
          title: {
            contains: word,
            mode: "insensitive",
          },
        })),
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * 20,
      take: 20,
    });

    if (!products) {
      return null;
    }

    return products.map(PrismaProductMapper.toDomain);
  }

  async update(data: Product): Promise<void> {
    const product = PrismaProductMapper.toPrisma(data);

    await prisma.product.update({
      where: {
        id: product.id,
      },
      data: product,
    });
  }
}
