import type { Encrypter } from "src/domain/store/application/cryptography/encrypter";
import { app } from "../app";
import jwt from "jsonwebtoken";

export class JwtEncrypter implements Encrypter {
  async encryptAccessToken(payload: Record<string, unknown>): Promise<string> {
    payload.permissions = ["read", "write", "delete"];

    const token = app.jwt.sign(payload);

    jwt.decode(token, { complete: true });

    const accessToken = app.jwt.sign(payload, {
      expiresIn: "60m",
      algorithm: "HS512",
    });

    return accessToken;
  }

  async encryptRefreshToken(payload: Record<string, unknown>): Promise<string> {
    const token = app.jwt.sign(payload);

    jwt.decode(token, { complete: true });

    const refreshToken = app.jwt.sign(payload, {
      expiresIn: "120m",
      algorithm: "HS512",
    });

    return refreshToken;
  }
}
