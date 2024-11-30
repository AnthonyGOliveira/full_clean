import {
  UpdateAccount,
  UpdateAccountResponse,
  UpdateAccountUseCase,
} from "../../../domain/usecases/update-account-use-case";
import { Encrypter } from "../../protocols/encrypter";
import { FindAccountByEmailRepository } from "../../protocols/find-account-repository";
import { PasswordValidator } from "../../protocols/password-validator";

export class DbUpdateAcountUseCase implements UpdateAccountUseCase {
  constructor(
    private readonly findAccountByEmailRepository: FindAccountByEmailRepository,
    private readonly passwordValidator: PasswordValidator,
    private readonly encrypter: Encrypter
  ) {}
  async execute(
    updateAccount: UpdateAccount
  ): Promise<UpdateAccountResponse | null> {
    const account = await this.findAccountByEmailRepository.find(
      updateAccount.email
    );
    if (!account) return null;
    if (this.hasPasswordUpdateFields(updateAccount)) {
      const passwordIsCorrect = await this.passwordValidator.compare(
        updateAccount.oldPassword,
        account.password
      );
      if (!passwordIsCorrect) {
        return null;
      }
      const hashedPassword = await this.encrypter.encrypt(
        updateAccount.password
      );
    }
    return null;
  }
  private hasPasswordUpdateFields(updateAccount: UpdateAccount): boolean {
    return !!updateAccount?.oldPassword && !!updateAccount?.password;
  }
}
