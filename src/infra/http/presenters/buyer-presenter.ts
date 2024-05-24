import { User } from "src/domain/store/enterprise/entities/user";

export class BuyerPresenter {
  static toHTTP(user: User) {
    // TODO retirar o id do usuário de todas as requisições
    // TODO O acesso ao id do usuário no forntend será feito atravéz do token
    return {
      id: user.id.toString(),
      username: user.username,
      email: user.email,
      createAt: user.createdAt,
      updateAt: user.updatedAt,
    };
  }
}
