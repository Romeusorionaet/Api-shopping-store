import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { faker } from "@faker-js/faker";
import {
  Product,
  ProductProps,
} from "src/domain/store/enterprise/entities/product";
import { Slug } from "src/domain/store/enterprise/entities/value-objects/slug";

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
      stockQuantity: faker.number.int(),
      minimumQuantityStock: faker.number.int(),
      discountPercentage: faker.number.int(),
      width: faker.number.int(),
      height: faker.number.int(),
      weight: faker.number.int(),
      corsList: ["color1", "color2", "color3", "color4"],
      placeOfSale: "ONLINE_STORE",
      star: faker.number.int(),
      ...override,
    },
    id,
  );

  return product;
}
