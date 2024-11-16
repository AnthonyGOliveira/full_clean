import { Router } from "express";
import LoginControllerFactory from "../../factories/login";
import RouteAdapter from "../../adapters/express-route";

export default (router: Router) => {
  router.post("/login", RouteAdapter(LoginControllerFactory()));
};
