"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const home_controller_1 = require("../controllers/home.controller");
const homeRouter = (0, express_1.Router)();
homeRouter.get("/", auth_middleware_1.authorize, home_controller_1.getHomePage);
exports.default = homeRouter;
