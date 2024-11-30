import { Role } from "./role-model";

export interface UpdateAccountModel {
    id: string;
    name: string;
    email: string;
    role: Role;
  }