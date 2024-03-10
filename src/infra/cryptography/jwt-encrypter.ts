import { compare, hash } from "bcryptjs";
import { HashComparer } from "src/domain/store/application/cryptography/hash-comparer";
import { HashGenerator } from "src/domain/store/application/cryptography/hash-generator";

export class Bcrypt implements HashGenerator, HashComparer {
  private HASH_SALT_LENGTH = 8;

  async hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGTH);
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash);
  }
}
