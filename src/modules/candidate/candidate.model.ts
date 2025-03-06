import { model, Schema } from "mongoose";
import { TCandidate } from "./candidate.interface";

const candidateSchema = new Schema<TCandidate>({
  uid: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  examSet: {
    type: [Schema.Types.ObjectId],
    ref: "Exam",
    required: true,
  },
});

export const CandidateModel = model("Candidate", candidateSchema);
