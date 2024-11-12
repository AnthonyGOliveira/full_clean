import { DbAddAcountUseCase } from "../../data/usecases/db-add-acount-use-case";
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account";
import { BCryptAdapter } from "../../infra/encryption/bcrypt-adapter";
import { LogControllerDecorator } from "../../presentation/controllers/decorators/log-controller";
import { SignUpController } from "../../presentation/controllers/signup/signup";
import { Controller } from "../../presentation/protocols/controller";
import LoggerFactory from "./logger";
import SignupValidationCompositeFactory from "./validation-composite/signup-validation-composite";

export default (): Controller => {
  const encrypter = new BCryptAdapter();
  const validationComposite = SignupValidationCompositeFactory();
  const accountMongoRepository = new AccountMongoRepository();
  const addAcountUseCase = new DbAddAcountUseCase(
    encrypter,
    accountMongoRepository
  );
  const signUpController = new SignUpController(
    addAcountUseCase,
    validationComposite
  );
  const logger = LoggerFactory();
  return new LogControllerDecorator(signUpController, logger);
};
