import { BuyerAddressRepository } from "src/domain/store/application/repositories/buyer-address-repository";
import { BuyerAddress } from "src/domain/store/enterprise/entities/buyer-address";
import { prisma } from "src/infra/service/setup-prisma/prisma";
import { PrismaBuyerAddressMapper } from "../mappers/prisma-buyer-address-mapper";
import { CacheKeysPrefix } from "src/core/constants/cache-keys-prefix";
import { CacheRepository } from "src/infra/cache/cache-repository";

export class PrismaBuyerAddressRepository implements BuyerAddressRepository {
  constructor(private cacheRepository: CacheRepository) {}

  async findByBuyerId(buyerId: string): Promise<BuyerAddress[] | null> {
    const cacheKey = `${CacheKeysPrefix.BUYER_ADDRESS}:unique:${buyerId}`;

    const cacheHit = await this.cacheRepository.get(cacheKey);

    if (cacheHit) {
      const cacheData = JSON.parse(cacheHit);

      return cacheData.map(PrismaBuyerAddressMapper.toDomain);
    }

    const buyerAddress = await prisma.buyerAddress.findMany({
      where: {
        buyerId,
      },
    });

    if (!buyerAddress) {
      return null;
    }

    const buyerAddressMapped = buyerAddress.map(
      PrismaBuyerAddressMapper.toDomain,
    );

    await this.cacheRepository.set(cacheKey, JSON.stringify(buyerAddress));

    return buyerAddressMapped;
  }
}
