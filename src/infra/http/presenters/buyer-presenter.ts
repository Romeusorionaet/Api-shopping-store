import { User } from "src/domain/store/enterprise/entities/user";

export class BuyerPresenter {
  static toHTTP(user: User) {
    return {
      publicId: user.publicId.toString(),
      username: user.username,
      email: user.email,
      picture: user.picture,
      createAt: user.createdAt,
      updateAt: user.updatedAt,
    };
  }
}
