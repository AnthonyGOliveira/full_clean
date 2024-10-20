import { AddAcountModel } from "../../../../data/models/add-acount-model";
import {
  AddAcount,
  AddAcountRepository,
} from "../../../../data/protocols/add-acount-repository";
import { mapperToAccontModel } from "../../../mapper/account-mapper";
import { MongoDatabaseHelper } from "../helpers/mongodb-helper";

export class AccountMongoRepository implements AddAcountRepository {
  async add(addAcount: AddAcount): Promise<AddAcountModel> {
    const accountCollection = await MongoDatabaseHelper.getCollection("accounts");
    const result = await accountCollection.insertOne(addAcount);
    return mapperToAccontModel(addAcount, result.insertedId.toString());
  }
}
