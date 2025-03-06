import { Types } from "mongoose";

export type TAssignment = {
    GId: string;
    assignmentGId?: string;
    course_id: Types.ObjectId ;
    milestoneId: Types.ObjectId | string;
    subject: string;
    detail:string;
    totalMarks: number;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
};

export type TSubmittedAssignment = {
    assignment_id: Types.ObjectId | string;
    assignmentLink:string;
    student_id?: Types.ObjectId | string;
    totalMark?: number;
    achievedMark?: number; 
  };
  