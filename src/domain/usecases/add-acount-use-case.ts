import { AddAcountModel } from "../models/add-acount-model";

export interface AddAcount {
  name: string;
  email: string;
  password: string;
}

export interface AddAcountUseCase {
  execute(addAcount: AddAcount): Promise<AddAcountModel>;
}
