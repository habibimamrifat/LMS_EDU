import { Types } from "mongoose";

export type TComment = {
    postId: Types.ObjectId;
    description: string;
    replyList: string[];
    isDeleted?: boolean;
};
  