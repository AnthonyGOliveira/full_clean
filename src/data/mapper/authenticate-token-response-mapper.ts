import { AuthenticateTokenResponse } from "../../domain/usecases/authenticate-token-use -case";
import { TokenVerifierResponse } from "../protocols/token-verifier";

export const AuthenticateTokenResponseMapper = (
  tokenResponse: TokenVerifierResponse
): AuthenticateTokenResponse => {
  return {
    id: tokenResponse.id,
  };
};
