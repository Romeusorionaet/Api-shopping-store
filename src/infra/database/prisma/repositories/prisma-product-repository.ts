import { ProductRepository } from "src/domain/store/application/repositories/product-repository";
import { Product } from "src/domain/store/enterprise/entities/product";
import { prisma } from "../prisma";
import { PrismaProductMapper } from "../mappers/prisma-product-mapper";

export class PrismaProductRepository implements ProductRepository {
  async create(product: Product): Promise<void> {
    const data = PrismaProductMapper.toPrisma(product);

    await prisma.product.create({
      data,
    });
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

  async searchMany(query: string, page: number): Promise<Product[]> {
    const queryWords = query.toLowerCase().split(" ");

    const result = await prisma.product.findMany({
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

    return result.map(PrismaProductMapper.toDomain);
  }
}
