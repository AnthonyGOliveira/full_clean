import { AddAcountModel } from "../../data/models/add-acount-model";
import { AddAcount } from "../../data/protocols/add-acount-repository";

export const mapperToAccontModel = (
  addAcount: AddAcount,
  id: string
): AddAcountModel => {
  return {
    id,
    ...addAcount,
  };
};
