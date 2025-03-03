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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCourses = exports.getCourse = exports.createCourse = void 0;
const Course_model_1 = __importDefault(require("../models/Course.model"));
const createCourse = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const files = req.files;
        const imageUrls = ((_a = files.images) === null || _a === void 0 ? void 0 : _a.map((file) => file.path)) || [];
        const videoUrl = (_b = files.video) === null || _b === void 0 ? void 0 : _b[0].path;
        const course = yield Course_model_1.default.create(Object.assign(Object.assign({}, req.body), { images: imageUrls, video: videoUrl, user: req.userId }));
        res.status(201).json({
            success: true,
            message: "Course created successfully",
            data: course,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createCourse = createCourse;
const getCourse = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const course = yield Course_model_1.default.findById({ _id: req.params.courseId });
        res.status(200).json({
            success: true,
            data: course,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getCourse = getCourse;
const getAllCourses = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courses = yield Course_model_1.default.find();
        res.status(200).json({
            success: true,
            data: courses,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllCourses = getAllCourses;
