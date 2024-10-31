import { AddAcountModel } from "../models/add-acount-model";

export interface FindAccount {
  email: string;
  password: string;
}

export interface FindAccountUseCase {
  execute(addAcount: FindAccount): Promise<AddAcountModel>;
}
