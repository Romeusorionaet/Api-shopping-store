import { RefreshToken } from "../../enterprise/entities/refresh-token";

export interface RefreshTokensRepository {
  create(userId: string): Promise<RefreshToken>;
  refreshToken(refreshToken: string): Promise<RefreshToken | null>;
  deleteMany(userId: string): Promise<void>;
}
