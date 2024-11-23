export class ForbiddenError extends Error {
    constructor() {
      super(`Forbidden access`);
      this.name = "ForbiddenError";
    }
  }
  