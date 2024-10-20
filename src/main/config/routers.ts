import { Express, Router } from "express";
import SignUpRouter from "../routers/signup";
export default (app: Express) => {
  const router = Router();
  app.use("/api", router);
  SignUpRouter(router);
};
