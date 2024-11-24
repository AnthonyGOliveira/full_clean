import {
  TokenVerifier,
  TokenVerifierResponse,
} from "../../data/protocols/token-verifier";
import jwt from "jsonwebtoken";
import { config } from "../../main/config/config";

export class JsonWebTokenVerifier implements TokenVerifier {
  verify(token: string): TokenVerifierResponse {
    jwt.verify(token, config.token.secret);
    return;
  }
}
