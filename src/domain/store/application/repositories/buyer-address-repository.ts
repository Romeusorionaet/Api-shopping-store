import { BuyerAddress } from "../../enterprise/entities/buyer-address";

export interface BuyerAddressRepository {
  create(buyerAddress: BuyerAddress): Promise<BuyerAddress>;
  findById(buyerId: string): Promise<BuyerAddress | null>;
  update(buyerAddress: BuyerAddress): Promise<BuyerAddress>;
}
