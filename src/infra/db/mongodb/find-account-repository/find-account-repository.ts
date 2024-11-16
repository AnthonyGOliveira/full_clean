import { FindAcountModel } from "../../../../data/models/find-account-model";
import { FindAccountByEmailRepository } from "../../../../data/protocols/find-account-repository";
import { mapperToFindAccountModel } from "../../../mapper/find-account-mapper";
import { MongoDatabaseHelper } from "../helpers/mongodb-helper";

export class FindAccountByEmailMongoRepository
  implements FindAccountByEmailRepository
{
  async find(email: string): Promise<FindAcountModel> {
    const accountCollection = await MongoDatabaseHelper.getCollection(
      "accounts"
    );
    const result = await accountCollection.findOne({ email: email });
    return mapperToFindAccountModel({
      _id: result._id.toString(),
      name: result.name,
      email: result.email,
      password: result.password,
    });
  }
}
