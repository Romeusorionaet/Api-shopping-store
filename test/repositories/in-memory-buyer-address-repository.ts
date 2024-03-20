import { BuyerAddressRepository } from "src/domain/store/application/repositories/buyer-address-repository";
import { BuyerAddress } from "src/domain/store/enterprise/entities/buyer-address";

export class InMemoryBuyerAddressRepository implements BuyerAddressRepository {
  public items: BuyerAddress[] = [];

  async create(data: BuyerAddress): Promise<void> {
    this.items.push(data);
  }

  async update(buyerAddress: BuyerAddress): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === buyerAddress.id,
    );

    this.items[itemIndex] = buyerAddress;
  }

  async findById(addressId: string): Promise<BuyerAddress | null> {
    const buyerAddress = this.items.find(
      (items) => items.id.toString() === addressId,
    );

    if (!buyerAddress) {
      return null;
    }

    return buyerAddress;
  }

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
