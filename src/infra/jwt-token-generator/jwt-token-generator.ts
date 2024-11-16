import jwt from "jsonwebtoken";
import { AccountTokenModel } from "../../data/models/account-token-model";
import {
  TokenGenerator,
  TokenResponse,
} from "../../data/protocols/token-generator";
import { config } from "../../main/config/config";

interface JwtPayload {
  sub: string;
  email: string;
}

export class JwtTokenGenerator implements TokenGenerator {
  generate(account: AccountTokenModel): TokenResponse {
    const payload = this.generatePayload(account);
    const options = this.getOptions();
    const token = jwt.sign(payload, config.token.secret, options);
    return {
      accessToken: token,
      expiresIn: options.expiresIn,
    };
  }
  private generatePayload(account: AccountTokenModel): JwtPayload {
    return {
      sub: account.id,
      email: account.email,
    };
  }
  private getOptions() {
    return {
      expiresIn: config.token.timeToExpire,
    };
  }
}
