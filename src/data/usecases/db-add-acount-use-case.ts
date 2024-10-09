import { AddAcountModel } from "../../domain/models/add-acount-model";
import {
  AddAcount,
  AddAcountUseCase,
} from "../../domain/usecases/add-acount-use-case";
import { AddAcountRepository } from "../protocols/add-acount-repository";
import { Encrypter } from "../protocols/encrypter";

export class DbAddAcountUseCase implements AddAcountUseCase {
  private readonly encrypter: Encrypter;
  private readonly addAcountRepository: AddAcountRepository;

  constructor(encrypter: Encrypter, addAcountRepository: AddAcountRepository) {
    this.encrypter = encrypter;
    this.addAcountRepository = addAcountRepository;
  }

  async execute(addAcount: AddAcount): Promise<AddAcountModel> {
    const hashedPassword = await this.encrypter.encrypt(addAcount.password);
    const addAcountModel = await this.addAcountRepository.add(
      Object.assign({}, addAcount, { password: hashedPassword })
    );
    return addAcountModel;
  }
}
