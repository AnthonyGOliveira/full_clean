import { ServerError } from "../errors/server-error";
import { HttpResponse } from "../protocols/http";

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error.message,
});

export const unauthorizedRequest = (error: Error): HttpResponse => ({
  statusCode: 401,
  body: error.message,
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

export const conflict = (error: Error): HttpResponse => ({
  statusCode: 409,
  body: error.message,
});

export const forbidden = (error: Error): HttpResponse => ({
  statusCode: 403,
  body: error.message,
});
