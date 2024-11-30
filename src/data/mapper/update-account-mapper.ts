import { FindAcountModel } from "../models/find-account-model";
import {
  Role,
  UpdateAccount as UpdateAccountRepo,
} from "../protocols/update-account-repository";
import { UpdateAccount } from "../../domain/usecases/update-account-use-case";
export const mapperToUpdateAccountRepo = (
  updateAccount: UpdateAccount,
  findAccount: FindAcountModel,
  hashedPassword?: string
): UpdateAccountRepo => {
  return {
    id: findAccount.id,
    name: updateAccount.name,
    email: updateAccount.email,
    role: updateAccount.role as Role,
    ...(hashedPassword && { password: hashedPassword }),
  };
};
