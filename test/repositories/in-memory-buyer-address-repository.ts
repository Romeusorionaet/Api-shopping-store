import { BuyerAddressRepository } from "src/domain/store/application/repositories/buyer-address-repository";
import { BuyerAddress } from "src/domain/store/enterprise/entities/buyer-address";

export class InMemoryBuyerAddressRepository implements BuyerAddressRepository {
  public items: BuyerAddress[] = [];

  async findByBuyerId(buyerId: string): Promise<BuyerAddress[] | null> {
    const buyerAddress = this.items.filter(
      (items) => items.buyerId.toString() === buyerId,
    );

    if (!buyerAddress) {
      return null;
    }

    return buyerAddress;
  }
}
