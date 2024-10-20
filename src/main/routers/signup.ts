import { Router } from "express";
import SignUpControllerFactory from "../factories/signup";
import RouteAdapter from "../adapters/express-route";

export default (router: Router) => {
  router.post("/signup", RouteAdapter(SignUpControllerFactory()));
};
