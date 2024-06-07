import { BuyerAddressRepository } from "src/domain/store/application/repositories/buyer-address-repository";
import { BuyerAddress } from "src/domain/store/enterprise/entities/buyer-address";
import { prisma } from "../prisma";
import { PrismaBuyerAddressMapper } from "../mappers/prisma-buyer-address-mapper";

export class PrismaBuyerAddressRepository implements BuyerAddressRepository {
  async findByBuyerId(buyerId: string): Promise<BuyerAddress[] | null> {
    const buyerAddress = await prisma.buyerAddress.findMany({
      where: {
        buyerId,
      },
    });

    if (!buyerAddress) {
      return null;
    }

    return buyerAddress.map(PrismaBuyerAddressMapper.toDomain);
  }
}
