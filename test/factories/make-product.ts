import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { faker } from "@faker-js/faker";
import {
  Product,
  ProductProps,
} from "src/domain/store/enterprise/entities/product";
import { Slug } from "src/domain/store/enterprise/entities/value-objects/slug";
import { ModeOfSale } from "@prisma/client";

export function MakeProduct(
  override: Partial<ProductProps> = {},
  id?: UniqueEntityID,
) {
  const product = Product.create(
    {
      categoryId: new UniqueEntityID(),
      categoryTitle: faker.lorem.sentence(15),
      title: faker.lorem.sentence(15),
      slug: Slug.create("title-slug-test-default"),
      description: faker.lorem.text(),
      price: faker.number.int(),
      imgUrlList: ["img1", "img2", "img3", "img4"],
      corsList: ["color1", "color2", "color3", "color4"],
      stockQuantity: faker.number.int(),
      minimumQuantityStock: faker.number.int(),
      discountPercentage: faker.number.int(),
      width: faker.number.int(),
      height: faker.number.int(),
      weight: faker.number.int(),
      placeOfSale: ModeOfSale.ONLINE_STORE,
      stars: faker.number.int(),
      ...override,
    },
    id,
  );

  return product;
}
