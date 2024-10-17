import { Request, Response, NextFunction } from "express";
export const Cors = (req: Request, res: Response, next: NextFunction) => {
  res.set("access-control-allow-origin", "*");
  res.set("access-control-allow-headers", "*");
  res.set("access-control-allow-methods", "*");
  next();
};
