import { Router } from "express";
import { createCourse, getAllCourses, getCourse } from "../controllers/course.controller";
import upload from "../config/multerConfig";

const courseRouter = Router();

courseRouter.get("/", getAllCourses);
courseRouter.post("/admin/create", upload, createCourse);
courseRouter.get("/:courseId", getCourse);

export default courseRouter;
