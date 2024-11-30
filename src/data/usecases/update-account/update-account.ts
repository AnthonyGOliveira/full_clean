import {
  UpdateAccount,
  UpdateAccountResponse,
  UpdateAccountUseCase,
} from "../../../domain/usecases/update-account-use-case";
import { FindAccountByEmailRepository } from "../../protocols/find-account-repository";

export class DbUpdateAcountUseCase implements UpdateAccountUseCase {
  constructor(
    private readonly findAccountByEmailRepository: FindAccountByEmailRepository
  ) {}
  async execute(
    updateAccount: UpdateAccount
  ): Promise<UpdateAccountResponse | null> {
    const account = this.findAccountByEmailRepository.find(updateAccount.email);
    if (!account) return null;
    return null;
  }
}
