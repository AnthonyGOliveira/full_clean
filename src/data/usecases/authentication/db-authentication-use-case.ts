import {
  AuthenticationUseCase,
  AuthResponse,
  LoginModel,
} from "../../../domain/usecases/authentication-use-case";
import { FindAccountByEmailRepository } from "../../protocols/find-account-repository";

export class DbAuthenticationUseCase implements AuthenticationUseCase {
  private readonly findAccountByEmailRepository: FindAccountByEmailRepository;

  constructor(findAccountByEmailRepository: FindAccountByEmailRepository) {
    this.findAccountByEmailRepository = findAccountByEmailRepository;
  }
  async execute(loginAccount: LoginModel): Promise<AuthResponse | null> {
    await this.findAccountByEmailRepository.find(loginAccount.email);
    return null;
  }
}
