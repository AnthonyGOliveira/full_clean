import { NextFunction, Request, Response } from "express";
import { Middleware } from "../../presentation/protocols/middleware";
import { HttpRequest, HttpResponse } from "../../presentation/protocols/http";

export default (middleware: Middleware, role?: string) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    const httpRequest: HttpRequest = {
      body: {
        ...request.body,
        ...(role && { role }),
      },
      method: request.method,
      url: request.url,
      headers: request.headers,
    };
    const httpResponse: HttpResponse = await middleware.handle(httpRequest);
    if (httpResponse.statusCode !== 200) {
      response.status(httpResponse.statusCode).json(httpResponse.body);
    } else {
      next();
    }
  };
};
