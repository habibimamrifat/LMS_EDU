import { Types } from "mongoose";

export type TModule = {
    GId:string;
    moduleId?: string;
    moduleName: string;
    course_id: Types.ObjectId | string ;
    milestoneId: Types.ObjectId | string;
    videoList?: string[] | [];
    quizId?: Types.ObjectId | string;
    isCompleted?: boolean;
    isDeleted?: boolean;
};
  