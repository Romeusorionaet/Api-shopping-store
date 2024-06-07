import { BuyerAddress } from "../../enterprise/entities/buyer-address";

export interface BuyerAddressRepository {
  findByBuyerId(buyerId: string): Promise<BuyerAddress[] | null>;
}
