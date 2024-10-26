import { DbAddAcountUseCase } from "../../data/usecases/db-add-acount-use-case";
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account";
import { BCryptAdapter } from "../../infra/encryption/bcrypt-adapter";
import { LogControllerDecorator } from "../../presentation/controllers/decorators/log-controller";
import { SignUpController } from "../../presentation/controllers/signup";
import { Controller } from "../../presentation/protocols/controller";
import { EmailValidatorAdapter } from "../../utils/email-validator-adapter";
import LoggerFactory from "./logger";

export default (): Controller => {
  const emailValidator = new EmailValidatorAdapter();
  const encrypter = new BCryptAdapter();
  const accountMongoRepository = new AccountMongoRepository();
  const addAcountUseCase = new DbAddAcountUseCase(
    encrypter,
    accountMongoRepository
  );
  const signUpController = new SignUpController(
    emailValidator,
    addAcountUseCase
  );
  const logger = LoggerFactory();
  return new LogControllerDecorator(signUpController, logger);
};
