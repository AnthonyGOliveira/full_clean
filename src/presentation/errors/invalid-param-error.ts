export class InvalidParam extends Error {
  constructor(paramValue: string) {
    super(`Invalid param: ${paramValue}`);
    this.name = "InvalidParam";
  }
}
