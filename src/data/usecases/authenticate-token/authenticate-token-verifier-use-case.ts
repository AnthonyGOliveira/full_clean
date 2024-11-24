import {
  AuthenticateTokenResponse,
  AuthenticateTokenUseCase,
} from "../../../domain/usecases/authenticate-token-use -case";

export class AuthenticateTokenVerifierUseCase
  implements AuthenticateTokenUseCase
{
  execute(token: string): AuthenticateTokenResponse | null {
    return null;
  }
}
