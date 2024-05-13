import { Encrypter } from "src/domain/store/application/cryptography/encrypter";

export class FakeEncrypter implements Encrypter {
  async encryptAccessToken(payload: Record<string, unknown>): Promise<string> {
    return JSON.stringify(payload);
  }

  async encryptRefreshToken(payload: Record<string, unknown>): Promise<string> {
    return JSON.stringify(payload);
  }
}
