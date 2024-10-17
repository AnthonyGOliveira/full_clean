import { Express } from "express";
import { BodyParser } from "../middlewares/body-parser";
import { ContentType } from "../middlewares/content-type";
import { Cors } from "../middlewares/cors";
export default (app: Express) => {
  app.use(BodyParser);
  app.use(ContentType);
  app.use(Cors);
};
