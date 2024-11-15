import {
  AuthenticationUseCase,
  AuthResponse,
  LoginModel,
} from "../../../domain/usecases/authentication-use-case";
import { FindAccountByEmailRepository } from "../../protocols/find-account-repository";
import { PasswordValidator } from "../../protocols/password-validator";
import { TokenGenerator } from "../../protocols/token-generator";

export class DbAuthenticationUseCase implements AuthenticationUseCase {
  private readonly findAccountByEmailRepository: FindAccountByEmailRepository;
  private readonly passwordValidator: PasswordValidator;
  private readonly tokenGenerator: TokenGenerator;

  constructor(
    findAccountByEmailRepository: FindAccountByEmailRepository,
    passwordValidator: PasswordValidator,
    tokenGenerator: TokenGenerator
  ) {
    this.findAccountByEmailRepository = findAccountByEmailRepository;
    this.passwordValidator = passwordValidator;
    this.tokenGenerator = tokenGenerator;
  }
  async execute(loginAccount: LoginModel): Promise<AuthResponse | null> {
    const account = await this.findAccountByEmailRepository.find(
      loginAccount.email
    );
    if (!account) {
      return null;
    }

    const passwordIsCorrect = await this.passwordValidator.compare(
      loginAccount.password,
      account.password
    );

    if (!passwordIsCorrect) {
      return null;
    }

    return this.tokenGenerator.generate(account) as AuthResponse;
  }
}
