export class MissingParam extends Error {
  constructor(paramValue: string) {
    super(`Missing param: ${paramValue}`);
    this.name = "MissingParam";
  }
}
