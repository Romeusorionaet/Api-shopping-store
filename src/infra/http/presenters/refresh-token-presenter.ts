import { RefreshToken } from "src/domain/store/enterprise/entities/refresh-token";

export class RefreshTokenPresenter {
  static toHTTP(refreshToken: RefreshToken | null) {
    if (!refreshToken) {
      return null;
    }

    return {
      id: refreshToken.id.toString(),
      expires: refreshToken.expires,
    };
  }
}