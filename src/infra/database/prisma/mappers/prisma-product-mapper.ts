import { Prisma, Product as PrismaProduct } from "@prisma/client";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { Product } from "src/domain/store/enterprise/entities/product";
import { Slug } from "src/domain/store/enterprise/entities/value-objects/slug";

export class PrismaProductMapper {
  static toDomain(raw: PrismaProduct): Product {
    return Product.create(
      {
        title: raw.title,
        slug: Slug.create(raw.slug),
        categoryTitle: raw.categoryTitle,
        description: raw.description,
        discountPercentage: raw.discountPercentage,
        minimumQuantityStock: raw.minimumQuantityStock,
        stockQuantity: raw.stockQuantity,
        price: raw.price,
        imgUrlList: raw.imgUrlList,
        corsList: raw.corsList,
        stars: raw.stars,
        placeOfSale: raw.placeOfSale,
        categoryId: new UniqueEntityID(raw.categoryId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(product: Product): Prisma.ProductUncheckedCreateInput {
    return {
      id: product.id.toString(),
      title: product.title,
      slug: product.slug.value,
      categoryTitle: product.categoryTitle,
      description: product.description,
      discountPercentage: product.discountPercentage,
      minimumQuantityStock: product.minimumQuantityStock,
      stockQuantity: product.stockQuantity,
      price: product.price,
      imgUrlList: product.imgUrlList,
      corsList: product.corsList,
      stars: product.stars,
      placeOfSale: product.placeOfSale,
      categoryId: product.categoryId.toString(),
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
