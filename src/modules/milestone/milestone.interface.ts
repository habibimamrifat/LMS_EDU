import { Types } from "mongoose";

export type TMilestone = {
    milestoneName: string;
    course_id:Types.ObjectId | string;
    courseGId:string,
    GId:string;
    milestoneId: string;
    moduleList: string[];
    assignmentId?: Types.ObjectId | string;
    isCompleted?: boolean;
    isDeleted?: boolean;
};
  