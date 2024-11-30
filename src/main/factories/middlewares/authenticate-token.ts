import { AuthenticateTokenVerifierUseCase } from "../../../data/usecases/authenticate-token/authenticate-token-verifier-use-case";
import { JsonWebTokenVerifier } from "../../../infra/jwt-token-verifier/jwt-token-verifier";
import { AuthenticationMiddleware } from "../../../presentation/middlewares/authentication/authentication";
import { Middleware } from "../../../presentation/protocols/middleware";
import { LoggerAdapter } from "../../../utils/logger-adapter";

export default (): Middleware => {
  const loggerAdapter = new LoggerAdapter();
  const tokenVerifier = new JsonWebTokenVerifier();
  const authenticateTokenUseCase = new AuthenticateTokenVerifierUseCase(
    tokenVerifier,
    loggerAdapter
  );
  return new AuthenticationMiddleware(authenticateTokenUseCase);
};
