import { ServerError } from "../errors/server-error";
import { HttpResponse } from "../protocols/http";

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error,
});

export const unauthorizedRequest= (error: Error): HttpResponse => ({
  statusCode: 401,
  body: error,
});

export const serverError = (error: Error): HttpResponse => {
  const serverError = new ServerError(error.stack);
  return {
    statusCode: 500,
    body: {
      message: serverError.message,
      stack: serverError.stack,
    },
  };
};

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data,
});
