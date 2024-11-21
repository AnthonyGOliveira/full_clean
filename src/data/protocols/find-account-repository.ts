import { FindAcountModel } from "../models/find-account-model";

export interface FindAccountRepo {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface FindAccountByEmailRepository {
  find(email: string): Promise<FindAcountModel | null>;
}
