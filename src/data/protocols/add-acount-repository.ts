import { AddAcountModel } from "../models/add-acount-model";

export enum Role {
  USER = "user",
  ADMIN = "admin",
}

export interface AddAcount {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface AddAcountRepository {
  add(addAcount: AddAcount): Promise<AddAcountModel>;
}
