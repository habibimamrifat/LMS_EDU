import { Types } from "mongoose";

export type TQuestionPaper = {
  GId: string;
  questionPaperId?: string;

  course_id: Types.ObjectId
  milestoneId: Types.ObjectId | string;
  moduleId: Types.ObjectId | string;
 
  subject: string;
  duration: number;

  totalMarks?: number;
  MCQSet: TMCQ[];

  isCompleted?: boolean;
  isDeleted?: boolean;  
  createdAt: Date; 
  updatedAt: Date; 
};

export type TMCQ = {
  QPid: string;
  mcqId: string;
  question: string;
  options: string[];
  correctAns: 0 | 1 | 2 | 3;
  mark: number;
};
