import { UserAddress } from "../../enterprise/entities/user-address";

export interface UserAddressRepository {
  create(userAddress: UserAddress): Promise<void>;
  findByUserId(userId: string): Promise<UserAddress | null>;
}
