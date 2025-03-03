"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const course_controller_1 = require("../controllers/course.controller");
const multerConfig_1 = __importDefault(require("../config/multerConfig"));
const courseRouter = (0, express_1.Router)();
courseRouter.get("/", course_controller_1.getAllCourses);
courseRouter.post("/admin/create", multerConfig_1.default, course_controller_1.createCourse);
courseRouter.get("/:courseId", course_controller_1.getCourse);
exports.default = courseRouter;
