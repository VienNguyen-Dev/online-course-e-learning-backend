import mongoose from "mongoose";

export type ICourse = {
  _id: string;
  title: string;
  description: string;
  images: string[];
  video: string;
  courseDuration: string;
  courseLevel: string;
  author: string;
  curriculum: ICurriculum[];
};

export type DetailStepCurriculum = {
  lesson: string;
  stepDescription: string;
  stepDuration: string;
};

export type DetailCurriculum = {
  name: string;
  step: DetailStepCurriculum[];
};

export type ICurriculum = {
  numOfCurriculum: string;
  desCurriculum: DetailCurriculum;
};

const DetailStepCurriculumSchema = new mongoose.Schema<DetailStepCurriculum>({
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

const DetailCurriculumSchema = new mongoose.Schema<DetailCurriculum>({
  name: {
    type: String,
    required: true,
  },
  step: {
    type: [DetailStepCurriculumSchema],
    required: true,
  },
});

const CurriculumSchema = new mongoose.Schema<ICurriculum>({
  numOfCurriculum: {
    type: String,
    required: true,
  },
  desCurriculum: {
    type: DetailCurriculumSchema,
    required: true,
  },
});

export const CourseSchema = new mongoose.Schema<ICourse>(
  {
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
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", CourseSchema);
export default Course;
