import { User } from "src/domain/store/enterprise/entities/user";

export class BuyerPresenter {
  static toHTTP(user: User) {
    return {
      username: user.username,
      email: user.email,
      createAt: user.createdAt,
      updateAt: user.updatedAt,
    };
  }
}
