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
      price: faker.number.int({ max: 5 }),
      imgUrlList: ["img1", "img2", "img3", "img4"],
      corsList: ["color1", "color2", "color3", "color4"],
      stockQuantity: faker.number.int({ max: 3 }),
      minimumQuantityStock: faker.number.int({ max: 1 }),
      discountPercentage: faker.number.int({ max: 3 }),
      width: faker.number.int({ max: 3 }),
      height: faker.number.int({ max: 3 }),
      weight: faker.number.int({ max: 3 }),
      placeOfSale: ModeOfSale.ONLINE_STORE,
      stars: faker.number.int({ max: 100 }),
      ...override,
    },
    id,
  );

  return product;
}

export class ProductFactory {
  async makePrismaProduct(data: Partial<ProductProps> = {}): Promise<Product> {
    const product = makeProduct(data);
    console.log(product);

    await prisma.product.create({
      data: PrismaProductMapper.toPrisma(product),
    });

    return product;
  }
}
