import { Encrypter } from "src/domain/store/application/cryptography/encrypter";
import { app } from "../../app";
import jwt from "jsonwebtoken";

export class JwtEncrypter implements Encrypter {
  async encrypt(payload: Record<string, unknown>): Promise<string> {
    const token = app.jwt.sign(payload);
    jwt.decode(token, { complete: true });

    const accessToken = app.jwt.sign(payload, { expiresIn: "50s" });

    return accessToken;
  }
}
