import {
  AuthenticateTokenResponse,
  AuthenticateTokenUseCase,
} from "../../../domain/usecases/authenticate-token-use -case";
import { AuthenticateTokenResponseMapper } from "../../mapper/authenticate-token-response-mapper";
import { Logger } from "../../protocols/logger";
import { TokenVerifier } from "../../protocols/token-verifier";

export class AuthenticateTokenVerifierUseCase
  implements AuthenticateTokenUseCase
{
  constructor(
    private readonly tokenVerifier: TokenVerifier,
    private readonly logger: Logger
  ) {}
  execute(token: string): AuthenticateTokenResponse | null {
    try {
      const tokenResponse = this.tokenVerifier.verify(token);
      return AuthenticateTokenResponseMapper(tokenResponse);
    } catch (error) {
      this.logger.debug("An error occurred in the token verification process", {
        error,
      });
      return null;
    }
  }
}
