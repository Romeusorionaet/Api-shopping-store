import { UsersRepository } from "src/domain/store/application/repositories/users-repository";
import { User } from "src/domain/store/enterprise/entities/user";

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = [];

  async create(user: User): Promise<void> {
    this.items.push(user);
  }

  async findById(id: string): Promise<User | null> {
    const user = this.items.find((item) => item.id.toString() === id);

    if (!user) {
      return null;
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((item) => item.email === email);

    if (!user) {
      return null;
    }

    return user;
  }

  async confirmEmail(token: string): Promise<object | null> {
    const userIndex = this.items.findIndex(
      (item) => item.validationId?.toString() === token,
    );

    if (userIndex !== -1) {
      this.items[userIndex].emailVerified = true;
      this.items[userIndex].validationId = null;

      return {};
    }

    return null;
  }
}
