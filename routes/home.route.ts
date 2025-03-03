import { Router } from "express";
import { authorize } from "../middlewares/auth.middleware";
import { getHomePage } from "../controllers/home.controller";

const homeRouter = Router();

homeRouter.get("/", authorize, getHomePage);

export default homeRouter;
