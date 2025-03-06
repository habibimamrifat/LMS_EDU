import { Types } from "mongoose";
export interface ExamType {
    questionPaperId: Types.ObjectId | string,
    candidateId: Types.ObjectId | string,
    isSubmitted: boolean,
    totalMarks: number,
    acquiredMark: number,
    startTime: Date,
    endTime: Date,
    isDeleted: boolean,
    answerSheet: {
        qId: string,
        answer: number
    }[]
}