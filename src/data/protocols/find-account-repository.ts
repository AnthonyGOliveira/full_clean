import { FindAcountModel } from "../models/find-account-model";

export interface FindAccountByEmailRepository {
  find(email: string): Promise<FindAcountModel>;
}
