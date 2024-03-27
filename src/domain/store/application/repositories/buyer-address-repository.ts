import { BuyerAddress } from "../../enterprise/entities/buyer-address";

export interface BuyerAddressRepository {
  findById(addressId: string): Promise<BuyerAddress | null>;
  findByBuyerId(buyerId: string): Promise<BuyerAddress[] | null>;
  update(buyerAddress: BuyerAddress): Promise<void>;
}
