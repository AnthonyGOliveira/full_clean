import {
  AuthenticationUseCase,
  AuthResponse,
  LoginModel,
} from "../../../domain/usecases/authentication-use-case";
import { FindAccountByEmailRepository } from "../../protocols/find-account-repository";
import { PasswordValidator } from "../../protocols/password-validator";

export class DbAuthenticationUseCase implements AuthenticationUseCase {
  private readonly findAccountByEmailRepository: FindAccountByEmailRepository;
  private readonly passwordValidator: PasswordValidator;

  constructor(
    findAccountByEmailRepository: FindAccountByEmailRepository,
    passwordValidator: PasswordValidator
  ) {
    this.findAccountByEmailRepository = findAccountByEmailRepository;
    this.passwordValidator = passwordValidator;
  }
  async execute(loginAccount: LoginModel): Promise<AuthResponse | null> {
    const account = await this.findAccountByEmailRepository.find(
      loginAccount.email
    );
    if (!account) {
      return null;
    }

    await this.passwordValidator.compare(
      loginAccount.password,
      account.password
    );
  }
}
