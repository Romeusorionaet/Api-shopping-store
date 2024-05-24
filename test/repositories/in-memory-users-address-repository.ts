import { UserAddressRepository } from "src/domain/store/application/repositories/user-address-repository";
import { UserAddress } from "src/domain/store/enterprise/entities/user-address";

export class InMemoryUsersAddressRepository implements UserAddressRepository {
  public items: UserAddress[] = [];

  async create(userAddress: UserAddress): Promise<void> {
    this.items.push(userAddress);
  }

  async findByUserId(userId: string): Promise<UserAddress | null> {
    const userAddress = this.items.find(
      (items) => items.userId.toString() === userId,
    );

    if (!userAddress) {
      return null;
    }

    return userAddress;
  }

  async update(userAddress: UserAddress): Promise<void> {
    const existingUserAddress = this.items.find(
      (item) => item.id === userAddress.id,
    );

    if (existingUserAddress) {
      Object.assign(existingUserAddress, userAddress);
    }
  }
}
