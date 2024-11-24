import {
  TokenVerifier,
  TokenVerifierResponse,
} from "../../data/protocols/token-verifier";
import jwt from "jsonwebtoken";
import { config } from "../../main/config/config";
import { TokenVerifierResponseMapper } from "../mapper/token-verifier-response-mapper";

export class JsonWebTokenVerifier implements TokenVerifier {
  verify(token: string): TokenVerifierResponse {
    const payload = jwt.verify(token, config.token.secret);
    return TokenVerifierResponseMapper(payload);
  }
}
