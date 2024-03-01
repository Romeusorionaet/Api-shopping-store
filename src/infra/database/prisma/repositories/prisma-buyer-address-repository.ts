import { BuyerAddressRepository } from "src/domain/store/application/repositories/buyer-address-repository";
import { BuyerAddress } from "src/domain/store/enterprise/entities/buyer-address";

export class PrismaBuyerAddressRepository implements BuyerAddressRepository {
  async create(buyerAddress: BuyerAddress): Promise<BuyerAddress> {
    throw new Error("Method not implemented.");
  }

  async findById(buyerId: string): Promise<BuyerAddress | null> {
    throw new Error("Method not implemented.");
  }

  async update(buyerAddress: BuyerAddress): Promise<BuyerAddress> {
    throw new Error("Method not implemented.");
  }
}
