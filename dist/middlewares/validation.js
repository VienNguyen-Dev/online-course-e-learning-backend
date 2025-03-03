"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCourse = exports.validateResetPassword = exports.validateChangePassword = exports.validateSignInUser = exports.validateSignUpUser = void 0;
const express_validator_1 = require("express-validator");
const handleValidationErrors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array().map((err) => err.msg) });
    }
    next();
});
exports.validateSignUpUser = [
    (0, express_validator_1.body)("fullname").trim().notEmpty().withMessage("Full Name is required").isLength({ min: 3 }).withMessage("Full Name must be at least 3 characters long"),
    (0, express_validator_1.body)("email").isEmail().withMessage("Invalid email format"),
    (0, express_validator_1.body)("password").trim().notEmpty().withMessage("Password is required").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),
    handleValidationErrors,
];
exports.validateSignInUser = [
    (0, express_validator_1.body)("email").isEmail().withMessage("Invalid email format"),
    (0, express_validator_1.body)("password").trim().notEmpty().withMessage("Password is required").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),
    handleValidationErrors,
];
exports.validateChangePassword = [
    (0, express_validator_1.body)("password").trim().notEmpty().withMessage("Password is required").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),
    (0, express_validator_1.body)("passwordConfirm").trim().notEmpty().withMessage("Password is required").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),
    handleValidationErrors,
];
exports.validateResetPassword = [(0, express_validator_1.body)("email").isEmail().withMessage("Invalid email format"), handleValidationErrors];
exports.validateCourse = [
    (0, express_validator_1.body)("title").notEmpty().withMessage("Title is required").isLength({ min: 3, max: 100 }).withMessage("Title must be bettween 3 and 100 characters"),
    (0, express_validator_1.body)("description").notEmpty().withMessage("Description is required").isLength({ min: 3, max: 300 }).withMessage("Title must be bettween 3 and 300 characters"),
    (0, express_validator_1.body)("image").notEmpty().withMessage("Image is required").isArray({ min: 1, max: 5 }).withMessage("Image must at least one image"),
    (0, express_validator_1.body)("courseDuration").notEmpty().withMessage("Course Duration is required").isLength({ min: 1, max: 20 }).withMessage("Course duration must be between 1 and 20"),
    (0, express_validator_1.body)("courseLevel").notEmpty().withMessage("Course Level is required").isLength({ max: 50 }).withMessage("Course duration must be between 1 and 20"),
    (0, express_validator_1.body)("author").notEmpty().withMessage("Author is required").isLength({ min: 3, max: 50 }).withMessage("Author must be between 3 and 50 characters"),
    (0, express_validator_1.body)("curriculum").notEmpty().withMessage("Curriculum is required").isArray({ min: 1 }).withMessage("Curriculum must be at least 01 lesson"),
    handleValidationErrors,
];
