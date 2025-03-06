import { Types } from "mongoose";

export type TReply = {
    commentId: Types.ObjectId;
    description: string;
    isDeleted?: boolean;
};
  