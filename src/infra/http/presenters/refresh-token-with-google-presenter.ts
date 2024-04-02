import { RefreshToken } from "src/domain/store/enterprise/entities/refresh-token";

export class RefreshTokenWithGooglePresenter {
  static toHTTP(refreshToken: RefreshToken) {
    return {
      id: refreshToken.id.toString(),
      expires: refreshToken.expires,
    };
  }
}
