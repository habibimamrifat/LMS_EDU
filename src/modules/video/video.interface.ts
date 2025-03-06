import { Types } from "mongoose";

export type TVideo = {
    GId:string;
    videoId?: string;
    videoName: string;
    videoURL: string;
    course_id: Types.ObjectId | string ;
    milestoneId: Types.ObjectId | string;
    moduleId: Types.ObjectId | string;
    isCompleted?: boolean;
    isDeleted?: boolean;
};
  