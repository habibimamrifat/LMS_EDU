import { TMilestone } from "../milestone/milestone.interface";

export type TCourse = {
  GId:string,
  courseId?: string;
  courseName: string;
  amount: number;
  milestoneList?: TMilestone[];
  isCompleted?: boolean;
  isDeleted?: boolean;
};
