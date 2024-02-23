import { ProductRepository } from "../product-repository";
import { prisma } from "src/lib/prisma";
import { ProductProps } from "src/domain/store/enterprise/entities/product";

export class PrismaProductRepository implements ProductRepository {
  async create(data: ProductProps & { id: string }): Promise<void> {
    const prismaProductInput = {
      id: data.id,
      categoryId: data.categoryId.toString(),
      categoryTitle: data.categoryTitle,
      title: data.title,
      slug: data.slug.toString(),
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
      star: data.star,
      updatedAt: new Date(),
      createdAt: new Date(),
    };

    await prisma.product.create({
      data: prismaProductInput,
    });
  }

  async findById(id: string): Promise<ProductProps | null> {
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!product) {
      return null;
    }

    return product;
  }

  async searchMany(query: string, page: number): Promise<ProductProps[]> {
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
      skip: (page - 1) * 20,
      take: 20,
    });

    return result;
  }
}
