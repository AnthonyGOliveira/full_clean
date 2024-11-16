import { DbAuthenticationUseCase } from "../../data/usecases/authentication/db-authentication-use-case";
import { FindAccountByEmailMongoRepository } from "../../infra/db/mongodb/find-account-repository/find-account-repository";
import { JwtTokenGenerator } from "../../infra/jwt-token-generator/jwt-token-generator";
import { PasswordValidatorAdapter } from "../../infra/password-validator/password-validator";
import { LogControllerDecorator } from "../../presentation/controllers/decorators/log-controller";
import { LoginController } from "../../presentation/controllers/login/login";
import { Controller } from "../../presentation/protocols/controller";
import { EmailValidatorAdapter } from "../../utils/email-validator-adapter";
import LoggerFactory from "./logger";
import LoginValidationCompositeFactory from "./validation-composite/login/login-validation-composite";

export default (): Controller => {
  const findAccountByEmailRepository = new FindAccountByEmailMongoRepository();
  const passwordValidatorAdapter = new PasswordValidatorAdapter();
  const jwtTokenGenerator = new JwtTokenGenerator();
  const emailValidator = new EmailValidatorAdapter();
  const validationComposite = LoginValidationCompositeFactory();
  const authenticationUseCase = new DbAuthenticationUseCase(
    findAccountByEmailRepository,
    passwordValidatorAdapter,
    jwtTokenGenerator
  );
  const loginController = new LoginController(
    authenticationUseCase,
    emailValidator,
    validationComposite
  );
  const logger = LoggerFactory();
  return new LogControllerDecorator(loginController, logger);
};
