export interface Encrypter {
  encryptAccessToken(payload: Record<string, unknown>): Promise<string>;
  encryptRefreshToken(payload: Record<string, unknown>): Promise<string>;
}
