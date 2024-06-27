import { PaginationParams } from "src/core/repositories/pagination-params";
import { CategoryRepository } from "src/domain/store/application/repositories/category-repository";
import { Category } from "src/domain/store/enterprise/entities/category";
import { PrismaCategoryMapper } from "../mappers/prisma-category-mapper";
import { prisma } from "src/infra/service/setup-prisma/prisma";
import { CacheRepository } from "src/infra/cache/cache-repository";
import { CacheKeysPrefix } from "src/core/constants/cache-keys-prefix";
import { QuantityOfCategory } from "src/core/constants/quantity-of-category";
import { CacheTimeInMinutes } from "src/core/constants/cache-time-in-minutes";

export class PrismaCategoryRepository implements CategoryRepository {
  constructor(private cacheRepository: CacheRepository) {}

  async create(category: Category): Promise<void> {
    const data = PrismaCategoryMapper.toPrisma(category);

    await prisma.category.create({
      data,
    });

    await this.cacheRepository.deleteCacheByPattern(
      `${CacheKeysPrefix.CATEGORY_LIST}:*`,
    );
  }

  async findById(id: string): Promise<Category | null> {
    const cacheKey = `${CacheKeysPrefix.CATEGORY}:unique:${id}`;

    const cacheHit = await this.cacheRepository.get(cacheKey);

    if (cacheHit) {
      const cacheData = JSON.parse(cacheHit);

      return PrismaCategoryMapper.toDomain(cacheData);
    }

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return null;
    }

    const categoryMapped = PrismaCategoryMapper.toDomain(category);

    await this.cacheRepository.set(
      cacheKey,
      JSON.stringify(category),
      CacheTimeInMinutes.categoryTime,
    );

    return categoryMapped;
  }

  async findMany({ page }: PaginationParams): Promise<Category[]> {
    const cacheKey = `${CacheKeysPrefix.CATEGORY_LIST}:allCategories:${page}`;

    const cacheHit = await this.cacheRepository.get(cacheKey);

    if (cacheHit) {
      const cacheData = JSON.parse(cacheHit);

      return cacheData.map(PrismaCategoryMapper.toDomain);
    }

    const categories = await prisma.category.findMany({
      take: QuantityOfCategory.PER_PAGE,
      skip: (page - 1) * QuantityOfCategory.PER_PAGE,
      orderBy: {
        createdAt: "desc",
      },
    });

    const categoriesMapped = categories.map(PrismaCategoryMapper.toDomain);

    await this.cacheRepository.set(
      cacheKey,
      JSON.stringify(categories),
      CacheTimeInMinutes.categoryTime,
    );

    return categoriesMapped;
  }

  async findByTitle(title: string): Promise<Category | null> {
    const category = await prisma.category.findUnique({
      where: {
        title,
      },
    });

    if (!category) {
      return null;
    }

    return PrismaCategoryMapper.toDomain(category);
  }

  async update(category: Category): Promise<void> {
    const data = PrismaCategoryMapper.toPrisma(category);

    await prisma.category.update({
      where: {
        id: data.id,
      },
      data,
    });

    await this.cacheRepository.delete(
      `${CacheKeysPrefix.CATEGORY}:unique:${category.id}`,
    );

    await this.cacheRepository.deleteCacheByPattern(
      `${CacheKeysPrefix.CATEGORY_LIST}:*`,
    );
  }

  async remove(id: string): Promise<void> {
    await prisma.category.delete({
      where: {
        id,
      },
    });

    await this.cacheRepository.delete(
      `${CacheKeysPrefix.CATEGORY}:unique:${id}`,
    );

    await this.cacheRepository.deleteCacheByPattern(
      `${CacheKeysPrefix.CATEGORY_LIST}:*`,
    );
  }
}
