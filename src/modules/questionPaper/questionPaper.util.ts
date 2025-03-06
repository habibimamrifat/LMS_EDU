import mongoose, { Types } from "mongoose";
import { TMCQ } from "./questionPaper.interface";
import { QuestionPaperModel } from "./questionPaper.model";

// this function id to update eachg mcq with the question paper id and mcq id
const preSaveMcqDataModifier = (mcqArray: TMCQ[], QPid: string): TMCQ[] => {
  const modifiedMCQSet = mcqArray.map((mcq, index) => {
    return {
      ...mcq,
      QPid: QPid,
      mcqId: `${QPid}MCQ${index + 1}`,
    };
  });

  return modifiedMCQSet;
};

export const totalMarksCalculator = async (QPId: Types.ObjectId): Promise<any> => {
  const questionPaper = await QuestionPaperModel.findOne({ _id: QPId });
  if (!questionPaper) {
    throw new Error("Question Paper not found");
  }

  const totalMarks = questionPaper.MCQSet.reduce((acc, mcq) => acc + mcq.mark, 0);

  const updateTotalMarks = await QuestionPaperModel.findOneAndUpdate(
    { _id: QPId },
    { totalMarks },
    { new: true }
  );

  if (!updateTotalMarks) {
    throw new Error("Total Marks not updated");
  }

  return updateTotalMarks;
};


const questionPaperUtil = { preSaveMcqDataModifier, totalMarksCalculator };
export default questionPaperUtil;