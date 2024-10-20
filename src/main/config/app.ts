import express from "express";
import setupMiddlewares from "./middlewares";
import setupRouters from "./routers";

const app = express();
setupMiddlewares(app);
setupRouters(app);
export default app;
