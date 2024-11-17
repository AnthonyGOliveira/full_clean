import { Express, Router } from "express";
import LoginRouter from "../routers/login-routes/index";
export default (app: Express) => {
  const router = Router();
  app.use("/api", router);
  LoginRouter(router);
};
