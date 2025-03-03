"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const DetailStepCurriculumSchema = new mongoose_1.default.Schema({
    lesson: {
        type: String,
        required: true,
    },
    stepDescription: {
        type: String,
        required: true,
    },
    stepDuration: {
        type: String,
        required: true,
    },
});
const DetailCurriculumSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    step: {
        type: [DetailStepCurriculumSchema],
        required: true,
    },
});
const CurriculumSchema = new mongoose_1.default.Schema({
    numOfCurriculum: {
        type: String,
        required: true,
    },
    desCurriculum: {
        type: DetailCurriculumSchema,
        required: true,
    },
});
exports.CourseSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    images: {
        type: [String],
        required: true,
    },
    video: {
        type: String,
    },
    courseDuration: {
        type: String,
        required: true,
    },
    courseLevel: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    curriculum: {
        type: [CurriculumSchema],
        required: true,
    },
}, { timestamps: true });
const Course = mongoose_1.default.model("Course", exports.CourseSchema);
exports.default = Course;
