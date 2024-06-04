import { ProductRepository } from "src/domain/store/application/repositories/product-repository";
import { Product } from "src/domain/store/enterprise/entities/product";
import { prisma } from "../prisma";
import { PrismaProductMapper } from "../mappers/prisma-product-mapper";
import { PaginationParams } from "src/core/repositories/pagination-params";
import { OrderProduct } from "src/domain/store/enterprise/entities/order-product";
import { TechnicalProductDetails } from "src/domain/store/enterprise/entities/technical-product-details";
import { PrismaTechnicalProductDetailsMapper } from "../mappers/prisma-technical-product-details-mapper";
import { QuantityOfProducts } from "src/domain/store/application/constants/quantity-of-products";

export class PrismaProductRepository implements ProductRepository {
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
    }
  }

  async create(product: Product): Promise<void> {
    const data = PrismaProductMapper.toPrisma(product);

    await prisma.product.create({
      data,
    });
  }

  async createTechnicalProductDetails(
    data: TechnicalProductDetails,
  ): Promise<void> {
    const dataMapper = PrismaTechnicalProductDetailsMapper.toPrisma(data);

    await prisma.technicalProductDetails.create({
      data: dataMapper,
    });
  }

  async findMany({ page }: PaginationParams): Promise<Product[]> {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * QuantityOfProducts.PER_PAGE,
      take: QuantityOfProducts.PER_PAGE,
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

  async findManyByCategoryId(
    id: string,
    page: number,
  ): Promise<Product[] | null> {
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

    return products.map(PrismaProductMapper.toDomain);
  }

  async findTechnicalProductDetailsByProductId(
    id: string,
  ): Promise<TechnicalProductDetails | null> {
    const technicalProductDetails =
      await prisma.technicalProductDetails.findFirst({
        where: {
          productId: id,
        },
      });

    if (!technicalProductDetails) {
      return null;
    }

    return PrismaTechnicalProductDetailsMapper.toDomain(
      technicalProductDetails,
    );
  }

  async findTechnicalProductDetails(
    id: string,
  ): Promise<TechnicalProductDetails | null> {
    const technicalProductDetails =
      await prisma.technicalProductDetails.findUnique({
        where: {
          id,
        },
      });

    if (!technicalProductDetails) {
      return null;
    }

    return PrismaTechnicalProductDetailsMapper.toDomain(
      technicalProductDetails,
    );
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

  async searchMany(query: string, page: number): Promise<Product[] | null> {
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

  async updateTechnicalProductDetails(
    data: TechnicalProductDetails,
  ): Promise<void> {
    const technicalProductDetails =
      PrismaTechnicalProductDetailsMapper.toPrisma(data);

    await prisma.technicalProductDetails.update({
      where: {
        id: technicalProductDetails.id,
      },
      data: technicalProductDetails,
    });
  }

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
}
