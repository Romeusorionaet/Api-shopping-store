import { RefreshToken } from "../../enterprise/entities/refresh-token";

export interface RefreshTokensRepository {
  create(refreshToken: RefreshToken): Promise<RefreshToken>;
  refreshToken(refreshTokenId: string): Promise<RefreshToken | null>;
  deleteMany(userId: string): Promise<void>;
}
