import { NextFunction, Request, Response } from "express";
import Course from "../models/Course.model";
import mongoose from "mongoose";

export const createCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const imageUrls = files.images?.map((file) => file.path) || [];
    const videoUrl = files.video?.[0].path;

    const course = await Course.create({
      ...req.body,
      images: imageUrls,
      video: videoUrl,
      user: req.userId,
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

export const getCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const course = await Course.findById({ _id: req.params.courseId });
    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCourses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const courses = await Course.find();
    res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    next(error);
  }
};
