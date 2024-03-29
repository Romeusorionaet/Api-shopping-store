import { RefreshTokensRepository } from "src/domain/store/application/repositories/refresh-token-repository";
import { RefreshToken } from "src/domain/store/enterprise/entities/refresh-token";

export class InMemoryRefreshTokenRepository implements RefreshTokensRepository {
  public items: RefreshToken[] = [];

  async create(refreshToken: RefreshToken): Promise<RefreshToken> {
    this.items.push(refreshToken);

    return refreshToken;
  }

  async refreshToken(refreshTokenId: string): Promise<RefreshToken | null> {
    const refreshToken = this.items.find(
      (item) => item.id.toString() === refreshTokenId,
    );

    if (!refreshToken) {
      return null;
    }

    return refreshToken;
  }

  async deleteMany(userId: string): Promise<void> {
    this.items = this.items.filter((item) => item.userId.toString() !== userId);
  }
}
