import { PasswordValidator } from "../../data/protocols/password-validator";
import bcrypt from "bcrypt";

export class PasswordValidatorAdapter implements PasswordValidator {
  async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
