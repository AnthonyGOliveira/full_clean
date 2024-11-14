import {
  AuthenticationUseCase,
  AuthResponse,
  LoginModel,
} from "../../../domain/usecases/authentication-use-case";

export class DbAuthenticationUseCase implements AuthenticationUseCase {
  execute(addAcount: LoginModel): Promise<AuthResponse | null> {
    return null;
  }
}
