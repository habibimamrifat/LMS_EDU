import { Types } from "mongoose";

export type TCandidate = {
  uid: Types.ObjectId;
  examSet: [Types.ObjectId];
};
