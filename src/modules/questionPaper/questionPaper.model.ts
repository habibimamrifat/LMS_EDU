import mongoose, { model, Schema } from "mongoose";
import { TMCQ, TQuestionPaper } from "./questionPaper.interface";
import { ModuleModel } from "../module/module.model";

const TMCQSchema: Schema = new Schema<TMCQ>({
  QPid: {
    type: String,
    ref: "QuestionPaper",
    required: true,
  },
  mcqId:{
    type: String,
    ref: "QuestionPaper",
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
  },
  correctAns: {
    type: Number,
    enum: [0, 1, 2, 3],
    required: true,
  },
  mark: {
    type: Number,
    required: true,
  },
});

const questionPaperSchema = new Schema<TQuestionPaper>(
  {
    GId: {
      type: String,
      required: true,
    },
    questionPaperId: {
      type: String,
    },
    course_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Course",
    },
    milestoneId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Milestone",
    },
    moduleId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Module",
    },
    subject: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    totalMarks: {
      type: Number,
    },
    MCQSet: {
      type: [TMCQSchema],
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);





export const QuestionPaperModel = model<TQuestionPaper>(
  "QuestionPaper",
  questionPaperSchema
);
