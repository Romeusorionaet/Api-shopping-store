import { TechnicalProductDetailsRepository } from "src/domain/store/application/repositories/technical-product-details-repository";
import { TechnicalProductDetails } from "src/domain/store/enterprise/entities/technical-product-details";
import { PrismaTechnicalProductDetailsMapper } from "../mappers/prisma-technical-product-details-mapper";
import { prisma } from "src/infra/service/setup-prisma/prisma";
import { CacheRepository } from "src/infra/cache/cache-repository";

export class PrismaTechnicalProductDetailsRepository
  implements TechnicalProductDetailsRepository
{
  constructor(private cacheRepository: CacheRepository) {}

  async create(data: TechnicalProductDetails): Promise<void> {
    const dataMapper = PrismaTechnicalProductDetailsMapper.toPrisma(data);

    await prisma.technicalProductDetails.create({
      data: dataMapper,
    });

    await this.cacheRepository.deleteCacheByPattern(
      "technicalProductDetails:*",
    );
  }

  async findByProductId(id: string): Promise<TechnicalProductDetails | null> {
    const cacheKey = `technicalProductDetails:${id}`;

    const cacheHit = await this.cacheRepository.get(cacheKey);

    if (cacheHit) {
      const cacheData = JSON.parse(cacheHit);

      return PrismaTechnicalProductDetailsMapper.toDomain(cacheData);
    }

    const technicalProductDetails =
      await prisma.technicalProductDetails.findFirst({
        where: {
          productId: id,
        },
      });

    if (!technicalProductDetails) {
      return null;
    }

    const technicalProductDetailsMapped =
      PrismaTechnicalProductDetailsMapper.toDomain(technicalProductDetails);

    await this.cacheRepository.set(
      cacheKey,
      JSON.stringify(technicalProductDetails),
    );

    return technicalProductDetailsMapped;
  }

  async findById(id: string): Promise<TechnicalProductDetails | null> {
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

  async update(data: TechnicalProductDetails): Promise<void> {
    const technicalProductDetails =
      PrismaTechnicalProductDetailsMapper.toPrisma(data);

    await prisma.technicalProductDetails.update({
      where: {
        id: technicalProductDetails.id,
      },
      data: technicalProductDetails,
    });

    await this.cacheRepository.deleteCacheByPattern(
      "technicalProductDetails:*",
    );
  }
}
