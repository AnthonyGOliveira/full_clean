import { DbAddAcountUseCase } from "../../data/usecases/add-acount/db-add-acount-use-case";
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account";
import { FindAccountByEmailMongoRepository } from "../../infra/db/mongodb/find-account-repository/find-account-repository";
import { BCryptAdapter } from "../../infra/encryption/bcrypt-adapter";
import { LogControllerDecorator } from "../../presentation/controllers/decorators/log-controller";
import { SignUpController } from "../../presentation/controllers/signup/signup";
import { Controller } from "../../presentation/protocols/controller";
import LoggerFactory from "./logger";
import SignupValidationCompositeFactory from "./validation-composite/signup/signup-validation-composite";

export default (): Controller => {
  const encrypter = new BCryptAdapter();
  const validationComposite = SignupValidationCompositeFactory();
  const accountMongoRepository = new AccountMongoRepository();
  const findAccountByEmailRepository = new FindAccountByEmailMongoRepository();
  const addAcountUseCase = new DbAddAcountUseCase(
    encrypter,
    accountMongoRepository,
    findAccountByEmailRepository
  );
  const signUpController = new SignUpController(
    addAcountUseCase,
    validationComposite
  );
  const logger = LoggerFactory();
  return new LogControllerDecorator(signUpController, logger);
};
