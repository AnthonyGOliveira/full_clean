import { UpdateAccountModel } from "../models/update-account-model";

export enum Role {
  USER = "user",
  ADMIN = "admin",
}

export interface UpdateAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
}

export interface UpdateAccountRepository {
  update(updateAccount: UpdateAccount): Promise<UpdateAccountModel>;
}
