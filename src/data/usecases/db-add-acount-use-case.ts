import { AddAcountModel } from "../../domain/models/add-acount-model";
import {
  AddAcount,
  AddAcountUseCase,
} from "../../domain/usecases/add-acount-use-case";
import { Encrypter } from "../protocols/encrypter";

export class DbAddAcountUseCase implements AddAcountUseCase {
  private readonly encrypter: Encrypter;

  constructor(encrypter: Encrypter) {
    this.encrypter = encrypter;
  }

  async execute(addAcount: AddAcount): Promise<AddAcountModel> {
    const hashedPassword = await this.encrypter.encrypt(addAcount.password);
    const addAcountModel = {
      id: "valid_id",
      name: addAcount.name,
      email: addAcount.email,
      password: hashedPassword,
    };
    return new Promise((resolve) => resolve(addAcountModel));
  }
}
