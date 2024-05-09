import { Encrypter } from "src/domain/store/application/cryptography/encrypter";
import { app } from "../../app";
import jwt from "jsonwebtoken";

export class JwtEncrypter implements Encrypter {
  async encrypt(payload: Record<string, unknown>): Promise<string> {
    payload.permissions = ["read", "write", "delete"];

    const token = app.jwt.sign(payload);
    jwt.decode(token, { complete: true });

    const accessToken = app.jwt.sign(payload, {
      expiresIn: "1m",
      algorithm: "HS512",
    });

    return accessToken;
  }
}
