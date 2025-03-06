import { z } from "zod";
import { Types } from "mongoose";

const TMCQSchema = z.object({
  qid: z.string(),
  mcqId: z.string(),
  question: z.string(),
  options: z.array(z.string()).nonempty({ message: "Options cannot be empty" }),
  correctAns: z.number().int().min(0).max(3), // Ensure correctAns is an integer between 0 and 3
  mark: z.number().min(1, { message: "Mark must be greater than 0" }),
});

export const TQuestionPaperSchema = z.object({
  qid: z.string(),
  domain: z.string(),
  examineeId: z
    .string()
    .refine((val) => Types.ObjectId.isValid(val), { message: "Invalid ObjectId format" }),
  duration: z.number().min(1, { message: "Duration must be a positive number" }),
  totalMarks: z
    .number()
    .optional()
    .refine((val) => val === undefined || val >= 0, { message: "Total marks cannot be negative" }),
  MCQSet: z.array(TMCQSchema).nonempty({ message: "The MCQ set cannot be empty" }),
  isDeleted: z.boolean(),
});