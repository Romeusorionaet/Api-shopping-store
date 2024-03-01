import { ProductRepository } from "src/domain/store/application/repositories/product-repository";
import { Product } from "src/domain/store/enterprise/entities/product";
import { prisma } from "../prisma";
import { PrismaProductMapper } from "../mappers/prisma-product-mapper";

export class PrismaProductRepository implements ProductRepository {
  async create(data: Product): Promise<Product> {
    const prismaProductInput = {
      id: data.id.toString(),
      categoryId: data.categoryId.toString(),
      categoryTitle: data.categoryTitle,
      title: data.title,
      slug: data.slug.value,
      description: data.description,
      price: data.price,
      imgUrlList: data.imgUrlList,
      stockQuantity: data.stockQuantity,
      minimumQuantityStock: data.minimumQuantityStock,
      discountPercentage: data.discountPercentage,
      width: data.width,
      height: data.height,
      weight: data.weight,
      corsList: data.corsList,
      placeOfSale: data.placeOfSale,
      stars: data.stars,
    };

    const product = await prisma.product.create({
      data: prismaProductInput,
    });

    return PrismaProductMapper.toDomain(product);
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
