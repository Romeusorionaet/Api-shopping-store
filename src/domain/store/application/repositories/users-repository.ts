import { User } from "../../enterprise/entities/user";

export interface UsersRepository {
  create(user: User): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  confirmEmail(token: string): Promise<object | null>;
  update(user: User): Promise<void>;
}
