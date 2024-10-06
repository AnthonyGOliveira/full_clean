import { AddAcountModel } from "../models/AddAcountModel";

export interface AddAcount {
  name: string;
  email: string;
  password: string;
}

export interface AddAcountUseCase {
  execute(addAcount: AddAcount): Promise<AddAcountModel>;
}
