import { MissingParam } from "../../../errors/missing-param-error";
import { Validation } from "../validation";

export class RequiredFieldValidation implements Validation {
  private readonly field: string;
  constructor(field: string) {
    this.field = field;
  }
  validate(input: any): Error {
    if (!input[this.field]) {
      return new MissingParam(this.field);
    }
  }
}
