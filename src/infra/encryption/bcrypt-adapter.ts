import { Encrypter } from "../../data/protocols/encrypter";
import bcrypt from "bcrypt";

export class BCryptAdapter implements Encrypter {
  private readonly salt: string | number;
  constructor(salt: string | number = 12) {
    this.salt = salt;
  }
  async encrypt(password: string): Promise<string> {
    return await bcrypt.hash(password, this.salt);
  }
}
