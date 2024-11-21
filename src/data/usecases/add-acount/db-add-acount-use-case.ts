import { AddAcountModel } from "../../../domain/models/add-acount-model";
import {
  AddAcount,
  AddAcountUseCase,
} from "../../../domain/usecases/add-acount-use-case";
import {
  AddAcountRepository,
  Role,
} from "../../protocols/add-acount-repository";
import { Encrypter } from "../../protocols/encrypter";
import { FindAccountByEmailRepository } from "../../protocols/find-account-repository";

export class DbAddAcountUseCase implements AddAcountUseCase {
  private readonly encrypter: Encrypter;
  private readonly addAcountRepository: AddAcountRepository;
  private readonly findAccountByEmailRepository: FindAccountByEmailRepository;

  constructor(
    encrypter: Encrypter,
    addAcountRepository: AddAcountRepository,
    findAccountByEmailRepository: FindAccountByEmailRepository
  ) {
    this.encrypter = encrypter;
    this.addAcountRepository = addAcountRepository;
    this.findAccountByEmailRepository = findAccountByEmailRepository;
  }

  async execute(addAcount: AddAcount): Promise<AddAcountModel> {
    const emailExists = await this.findAccountByEmailRepository.find(
      addAcount.email
    );
    if (emailExists) {
      throw new Error("Email already registered");
    }
    const hashedPassword = await this.encrypter.encrypt(addAcount.password);
    const addAcountModel = await this.addAcountRepository.add(
      Object.assign({}, addAcount, {
        password: hashedPassword,
        role: Role.USER.toString(),
      })
    );
    return addAcountModel;
  }
}
