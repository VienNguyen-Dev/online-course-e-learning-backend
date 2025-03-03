import { validationResult, body, check } from "express-validator";
import { Request, Response, NextFunction, RequestHandler } from "express";

const handleValidationErrors = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array().map((err) => err.msg) });
  }
  next();
};

export const validateSignUpUser = [
  body("fullname").trim().notEmpty().withMessage("Full Name is required").isLength({ min: 3 }).withMessage("Full Name must be at least 3 characters long"),
  body("email").isEmail().withMessage("Invalid email format"),

  body("password").trim().notEmpty().withMessage("Password is required").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),
  handleValidationErrors,
];
export const validateSignInUser = [
  body("email").isEmail().withMessage("Invalid email format"),
  body("password").trim().notEmpty().withMessage("Password is required").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),
  handleValidationErrors,
];
export const validateChangePassword = [
  body("password").trim().notEmpty().withMessage("Password is required").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),
  body("passwordConfirm").trim().notEmpty().withMessage("Password is required").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),
  handleValidationErrors,
];
export const validateResetPassword = [body("email").isEmail().withMessage("Invalid email format"), handleValidationErrors];
export const validateCourse = [
  body("title").notEmpty().withMessage("Title is required").isLength({ min: 3, max: 100 }).withMessage("Title must be bettween 3 and 100 characters"),
  body("description").notEmpty().withMessage("Description is required").isLength({ min: 3, max: 300 }).withMessage("Title must be bettween 3 and 300 characters"),
  body("image").notEmpty().withMessage("Image is required").isArray({ min: 1, max: 5 }).withMessage("Image must at least one image"),
  body("courseDuration").notEmpty().withMessage("Course Duration is required").isLength({ min: 1, max: 20 }).withMessage("Course duration must be between 1 and 20"),
  body("courseLevel").notEmpty().withMessage("Course Level is required").isLength({ max: 50 }).withMessage("Course duration must be between 1 and 20"),
  body("author").notEmpty().withMessage("Author is required").isLength({ min: 3, max: 50 }).withMessage("Author must be between 3 and 50 characters"),
  body("curriculum").notEmpty().withMessage("Curriculum is required").isArray({ min: 1 }).withMessage("Curriculum must be at least 01 lesson"),
  handleValidationErrors,
];
