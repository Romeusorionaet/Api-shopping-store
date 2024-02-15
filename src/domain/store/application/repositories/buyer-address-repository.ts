import { BuyerAddress } from "../../enterprise/entities/buyer-address";

export interface BuyerAddressRepository {
  create(buyerAddress: BuyerAddress): Promise<BuyerAddress>;
  findById(buyerAddressId: string): Promise<BuyerAddress | null>;
}
