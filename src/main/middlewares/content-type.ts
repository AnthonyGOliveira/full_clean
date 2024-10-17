import { Request, Response, NextFunction } from "express";
export const ContentType = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.type("json");
  next();
};
