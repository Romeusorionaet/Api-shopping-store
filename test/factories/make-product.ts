import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { faker } from "@faker-js/faker";
import {
  Product,
  ProductProps,
} from "src/domain/store/enterprise/entities/product";
import { ModeOfSale } from "@prisma/client";
import { prisma } from "src/infra/database/prisma/prisma";
import { PrismaProductMapper } from "src/infra/database/prisma/mappers/prisma-product-mapper";

export function makeProduct(
  override: Partial<ProductProps> = {},
  id?: UniqueEntityID,
) {
  const product = Product.create(
    {
      categoryId: new UniqueEntityID(),
      categoryTitle: faker.lorem.sentence(15),
      title: faker.lorem.sentence(15),
      description: faker.lorem.text(),
      price: 458,
      imgUrlList: ["img1", "img2", "img3", "img4"],
      corsList: ["color1", "color2", "color3", "color4"],
      stockQuantity: 8,
      minimumQuantityStock: 2,
      discountPercentage: 20,
      placeOfSale: ModeOfSale.ONLINE_STORE,
      stars: 12,
      ...override,
    },
    id,
  );

  return product;
}

export class ProductFactory {
  async makePrismaProduct(data: Partial<ProductProps> = {}): Promise<Product> {
    const product = makeProduct(data);

    await prisma.product.create({
      data: PrismaProductMapper.toPrisma(product),
    });

    return product;
  }
}
