export class InvalidRequest extends Error {
  constructor(message: string = "Invalid request format.") {
    super(message);
    this.name = "InvalidRequest";
  }
}
