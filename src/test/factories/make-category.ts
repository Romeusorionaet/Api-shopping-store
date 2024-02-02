import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { faker } from "@faker-js/faker";
import {
  Category,
  CategoryProps,
} from "src/domain/store/enterprise/entities/category";
import { Slug } from "src/domain/store/enterprise/entities/value-objects/slug";

export function MakeCategory(
  override: Partial<CategoryProps> = {},
  id?: UniqueEntityID,
) {
  const category = Category.create(
    {
      title: faker.lorem.sentence(),
      productQuantity: 0,
      imgUrl: "https://defaul-url-test",
      slug: Slug.create("title-slug-test-default"),
      ...override,
    },
    id,
  );

  return category;
}
