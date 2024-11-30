import { ObjectId } from "mongodb";
import { UpdateAccountModel } from "../../../../data/models/update-account-model";
import {
  UpdateAccount,
  UpdateAccountRepository,
} from "../../../../data/protocols/update-account-repository";
import { MongoDatabaseHelper } from "../helpers/mongodb-helper";

export class UpdateAccountMongoRepositoryRepository
  implements UpdateAccountRepository
{
  async update(updateAccount: UpdateAccount): Promise<UpdateAccountModel> {
    const accountCollection = await MongoDatabaseHelper.getCollection(
      "accounts"
    );
    await accountCollection.updateOne(
      { _id: new ObjectId(updateAccount.id) },
      {
        name: updateAccount.name,
        email: updateAccount.email,
        role: updateAccount.role,
        ...(updateAccount?.password && { password: updateAccount.password }),
      }
    );

    return {
      id: updateAccount.id,
      name: updateAccount.name,
      email: updateAccount.email,
      role: updateAccount.role,
    };
  }
}
