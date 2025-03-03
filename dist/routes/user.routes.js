"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const user_controller_1 = require("../controllers/user.controller");
const userRouter = (0, express_1.Router)();
userRouter.get("/", user_controller_1.getUsers);
userRouter.get("/:id", auth_middleware_1.authorize, user_controller_1.getUser);
exports.default = userRouter;
