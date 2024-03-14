import { BuyerAddressRepository } from "src/domain/store/application/repositories/buyer-address-repository";
import { BuyerAddress } from "src/domain/store/enterprise/entities/buyer-address";
import { prisma } from "../prisma";
import { PrismaBuyerAddressMapper } from "../mappers/prisma-buyer-address-mapper";

export class PrismaBuyerAddressRepository implements BuyerAddressRepository {
  async create(buyerAddress: BuyerAddress): Promise<BuyerAddress> {
    const data = PrismaBuyerAddressMapper.toPrisma(buyerAddress);

    const newBuyerAddress = await prisma.buyerAddress.create({
      data,
    });

    return PrismaBuyerAddressMapper.toDomain(newBuyerAddress);
  }

  async findById(buyerId: string): Promise<BuyerAddress[]> {
    const buyerAddress = await prisma.buyerAddress.findMany({
      where: {
        id: buyerId,
      },
    });

    return buyerAddress.map(PrismaBuyerAddressMapper.toDomain);
  }

  async update(buyerAddress: BuyerAddress): Promise<void> {
    const data = PrismaBuyerAddressMapper.toPrisma(buyerAddress);

    await prisma.buyerAddress.update({
      where: {
        id: data.id,
      },
      data,
    });
  }
}
