import { BuyerAddressRepository } from "src/domain/store/application/repositories/buyer-address-repository";
import { BuyerAddress } from "src/domain/store/enterprise/entities/buyer-address";

export class InMemoryBuyerAddressRepository implements BuyerAddressRepository {
  public items: BuyerAddress[] = [];

  async findById(buyerId: string): Promise<BuyerAddress | null> {
    const buyerAddress = this.items.find(
      (items) => items.buyerId.toString() === buyerId,
    );

    if (!buyerAddress) {
      return null;
    }

    return buyerAddress;
  }

  async create(buyerAddress: BuyerAddress): Promise<BuyerAddress> {
    this.items.push(buyerAddress);

    return buyerAddress;
  }
}
