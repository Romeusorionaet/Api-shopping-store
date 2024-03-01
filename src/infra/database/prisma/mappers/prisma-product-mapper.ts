import { Product as PrismaProduct } from "@prisma/client";
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
        height: raw.height,
        weight: raw.weight,
        width: raw.width,
        stars: raw.stars,
        placeOfSale: raw.placeOfSale,
        categoryId: new UniqueEntityID(raw.categoryId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }
}
