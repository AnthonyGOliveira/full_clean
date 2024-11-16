import { AuthResponse } from "../../domain/usecases/authentication-use-case";
import { TokenResponse } from "../protocols/token-generator";

export const mapperToAuthResponse = (
  tokenResponse: TokenResponse
): AuthResponse => {
  return {
    accessToken: tokenResponse.accessToken,
    expiresIn: tokenResponse.expiresIn,
  };
};
