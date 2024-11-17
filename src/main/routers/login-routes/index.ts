import { Router } from "express";
import LoginControllerFactory from "../../factories/login";
import SignUpControllerFactory from "../../factories/signup";
import RouteAdapter from "../../adapters/express-route";

export default (router: Router) => {
  router.post("/login", RouteAdapter(LoginControllerFactory()));
  router.post("/signup", RouteAdapter(SignUpControllerFactory()));
};
