import { NextFunction, Request, Response } from "express";
import { Controller } from "../../presentation/protocols/controller";
import { HttpRequest, HttpResponse } from "../../presentation/protocols/http";

export default (controller: Controller) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    const httpRequest: HttpRequest = {
      body: request.body,
    };

    const httpResponse: HttpResponse = await controller.handle(httpRequest);
    response.status(httpResponse.statusCode).json(httpResponse.body);
  };
};
