import { TechnicalProductDetailsRepository } from "src/domain/store/application/repositories/technical-product-details-repository";
import { TechnicalProductDetails } from "src/domain/store/enterprise/entities/technical-product-details";
import { PrismaTechnicalProductDetailsMapper } from "../mappers/prisma-technical-product-details-mapper";
import { prisma } from "../prisma";

export class PrismaTechnicalProductDetailsRepository
  implements TechnicalProductDetailsRepository
{
  async create(data: TechnicalProductDetails): Promise<void> {
    const dataMapper = PrismaTechnicalProductDetailsMapper.toPrisma(data);

    await prisma.technicalProductDetails.create({
      data: dataMapper,
    });
  }

  async findByProductId(id: string): Promise<TechnicalProductDetails | null> {
    const technicalProductDetails =
      await prisma.technicalProductDetails.findFirst({
        where: {
          productId: id,
        },
      });

    if (!technicalProductDetails) {
      return null;
    }

    return PrismaTechnicalProductDetailsMapper.toDomain(
      technicalProductDetails,
    );
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
  }
}
