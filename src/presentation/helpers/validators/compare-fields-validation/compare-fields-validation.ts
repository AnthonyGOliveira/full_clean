import { InvalidParam } from "../../../errors/invalid-param-error";
import { Validation } from "../validation";

export class CompareFieldsValidation implements Validation {
  private readonly field: string;
  private readonly compareField: string;
  constructor(field: string, compareField: string) {
    this.field = field;
    this.compareField = compareField;
  }
  validate(input: any): Error {
    if (input[this.field] !== input[this.compareField]) {
      return new InvalidParam(this.compareField);
    }
  }
}
