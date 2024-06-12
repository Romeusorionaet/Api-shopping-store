import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { faker } from "@faker-js/faker";
import {
  Category,
  CategoryProps,
} from "src/domain/store/enterprise/entities/category";
import { prisma } from "src/infra/service/setup-prisma/prisma";
import { PrismaCategoryMapper } from "src/infra/database/prisma/mappers/prisma-category-mapper";

export function makeCategory(
  override: Partial<CategoryProps> = {},
  id?: UniqueEntityID,
) {
  const category = Category.create(
    {
      title: faker.lorem.sentence(),
      imgUrl: "https://defaul-url-test",
      ...override,
    },
    id,
  );

  return category;
}

export class CategoryFactory {
  async makePrismaCategory(
    data: Partial<CategoryProps> = {},
  ): Promise<Category> {
    const category = makeCategory(data);

    await prisma.category.create({
      data: PrismaCategoryMapper.toPrisma(category),
    });

    return category;
  }
}
