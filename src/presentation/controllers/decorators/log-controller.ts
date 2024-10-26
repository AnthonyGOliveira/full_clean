import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";
import { Logger } from "../../protocols/logger";


export class LogControllerDecorator implements Controller {
  private readonly controller: Controller;
  private readonly logger: Logger;

  constructor(controller: Controller, logger: Logger) {
    this.controller = controller;
    this.logger = logger;
  }
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { body, method, url } = httpRequest;
    this.logger.info(`Starting request - ${method} - ${url}`, { body });
    const result: HttpResponse = await this.controller.handle(httpRequest);
    this.checkStatusResult(httpRequest, result);
    return result;
  }

  private checkStatusResult(
    { method, url, body }: HttpRequest,
    response: HttpResponse
  ): void {
    if (response.statusCode === 500) {
      const error = new Error(
        response.body?.message || "Internal Server Error"
      );
      error.stack = response.body?.stack || "";
      this.logger.error(error, { body });
    } else {
      this.logger.info(`Ending request - ${method} - ${url}`, response?.body);
    }
  }
}
