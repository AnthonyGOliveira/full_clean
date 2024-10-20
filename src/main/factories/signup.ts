import { DbAddAcountUseCase } from "../../data/usecases/db-add-acount-use-case";
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account";
import { BCryptAdapter } from "../../infra/encryption/bcrypt-adapter";
import { SignUpController } from "../../presentation/controllers/signup";
import { Controller } from "../../presentation/protocols/controller";
import { EmailValidatorAdapter } from "../../utils/email-validator-adapter";
import { LoggerAdapter } from "../../utils/logger-adapter";

export default (): Controller => {
    const emailValidator = new EmailValidatorAdapter()
    const logger = new LoggerAdapter()
    const encrypter = new BCryptAdapter()
    const accountMongoRepository = new AccountMongoRepository()
    const addAcountUseCase = new DbAddAcountUseCase(encrypter, accountMongoRepository)
    return new SignUpController(emailValidator, logger, addAcountUseCase)
}