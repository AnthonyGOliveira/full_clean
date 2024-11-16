import { Express, Router } from "express";
import SignUpRouter from "../routers/signup/signup";
import LoginRouter from "../routers/login/login";
export default (app: Express) => {
  const router = Router();
  app.use("/api", router);
  SignUpRouter(router);
  LoginRouter(router);
};
