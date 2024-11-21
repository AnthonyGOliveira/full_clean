import { FindAcountModel } from "../../data/models/find-account-model";
import { FindAccountRepo } from "../../data/protocols/find-account-repository";

export const mapperToFindAccountModel = (
  findAccount: FindAccountRepo
): FindAcountModel => {
  return {
    id: findAccount._id,
    name: findAccount.name,
    email: findAccount.email,
    password: findAccount.password,
    role: findAccount.role,
  };
};
