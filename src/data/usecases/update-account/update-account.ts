import {
  UpdateAccount,
  UpdateAccountResponse,
  UpdateAccountUseCase,
} from "../../../domain/usecases/update-account-use-case";
import { mapperToUpdateAccountRepo } from "../../mapper/update-account-mapper";
import { FindAcountModel } from "../../models/find-account-model";
import { UpdateAccountModel } from "../../models/update-account-model";
import { Encrypter } from "../../protocols/encrypter";
import { FindAccountByEmailRepository } from "../../protocols/find-account-repository";
import { PasswordValidator } from "../../protocols/password-validator";
import { UpdateAccountRepository } from "../../protocols/update-account-repository";

export class DbUpdateAcountUseCase implements UpdateAccountUseCase {
  constructor(
    private readonly findAccountByEmailRepository: FindAccountByEmailRepository,
    private readonly passwordValidator: PasswordValidator,
    private readonly encrypter: Encrypter,
    private readonly updateAccountRepository: UpdateAccountRepository
  ) {}
  async execute(
    updateAccount: UpdateAccount
  ): Promise<UpdateAccountResponse | null> {
    const account = await this.findAccountByEmailRepository.find(
      updateAccount.email
    );
    if (!account) return null;
    const result = await this.updateAccount(updateAccount, account);
    if (!result) return null;
  }
  private hasPasswordUpdateFields(updateAccount: UpdateAccount): boolean {
    return !!updateAccount?.oldPassword && !!updateAccount?.password;
  }
  private async generateUpdateAccount(
    updateAccount: UpdateAccount,
    findAccount: FindAcountModel,
    hashedPassword?: string
  ): Promise<UpdateAccountModel> {
    const updateAccountFormat = mapperToUpdateAccountRepo(
      updateAccount,
      findAccount,
      hashedPassword
    );

    return await this.updateAccountRepository.update(updateAccountFormat);
  }
  private async updateAccount(
    updateAccount: UpdateAccount,
    findAccount: FindAcountModel
  ): Promise<UpdateAccountModel | null> {
    if (this.hasPasswordUpdateFields(updateAccount)) {
      const passwordIsCorrect = await this.passwordValidator.compare(
        updateAccount.oldPassword,
        findAccount.password
      );
      if (!passwordIsCorrect) {
        return null;
      }
      const hashedPassword = await this.encrypter.encrypt(
        updateAccount.password
      );
      return this.generateUpdateAccount(
        updateAccount,
        findAccount,
        hashedPassword
      );
    } else {
      return this.generateUpdateAccount(updateAccount, findAccount);
    }
  }
}
