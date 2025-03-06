
import { idFor } from "../../constents";
import idGenerator from "../../util/idGenarator";
import { TMCQ, TQuestionPaper } from "./questionPaper.interface";
import { QuestionPaperModel } from "./questionPaper.model";
import questionPaperUtil from "./questionPaper.util";
import { ModuleModel } from "../module/module.model";
import mongoose, { Types } from "mongoose";
import idConverter from "../../util/idConvirter";


export const getAllQuestionPapers = async () => {
  const result = await QuestionPaperModel.find({ isDeleted: false }).select({
    _id: 0,
    isDeleted: 0,
    __v: 0,
    createdAt: 0,
    updatedAt: 0,
    MCQSet: 0,
  });
  return result;
};

// examinee
export const getQuestionPapersOfExaminee = async (examineeId: string) => {
  console.log(examineeId);
  const result = await QuestionPaperModel.find({
    examineeId,
    isDeleted: false,
  }).select({
    _id: 0,
    isDeleted: 0,
    __v: 0,
    createdAt: 0,
    updatedAt: 0,
  });
  return result;
};

// candidate
export const getSingleQuestionPaper = async (qid: string) => {
  console.log("Received ID:", qid); // Debugging log

  const convertedId = idConverter(qid);
  console.log("Converted ID:", convertedId); // Debugging log

  if (!convertedId) {
    throw new Error("Invalid Id");
  }

  const result = await QuestionPaperModel.findOne({
    _id: convertedId,
    isDeleted: false,
  }).select("-isDeleted -__v -createdAt -updatedAt");

  console.log("Query Result:", result); // Debugging log

  if (!result) {
    throw new Error("Question Paper not found");
  }

  return result;
};


// examinee


const createQuestionPaper = async (payload: TQuestionPaper) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const modifiedQuestionPaperModel = idGenerator.asDocumentModel(QuestionPaperModel);
    const questionPaperId = await idGenerator.collectionIdGenerator(modifiedQuestionPaperModel,idFor.quiz,payload.course_id);

    payload.MCQSet = questionPaperUtil.preSaveMcqDataModifier(
      payload.MCQSet,
      questionPaperId
    );

    payload.GId = questionPaperId;
    payload.questionPaperId = questionPaperId;

    const isModuleExist = await ModuleModel.findById(payload.moduleId).session(session);
    if (!isModuleExist) {
      throw new Error("Module not found");
    }

    if(isModuleExist.quizId)
    {
      throw Error("this module already has quiz")
    }

    const createQuiz = await QuestionPaperModel.create([payload], { session });
    const createdQuizId = createQuiz[0]._id;

    const updateModule = await ModuleModel.updateOne(
      { _id: payload.moduleId },
      { $set: { quizId: createdQuizId } },
      { session }
    );

    if (updateModule.modifiedCount < 1) {
      throw new Error("Module update failed");
    }

    await session.commitTransaction();
    session.endSession();

    // Update question paper marks separately after transaction completion
    await questionPaperUtil.totalMarksCalculator(createdQuizId);

    return createQuiz[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};


// examinee

const addMCQIntoQuestionPaper = async (id:string, mcq: TMCQ) => {
  const convertQPId = idConverter(id);
  if(!convertQPId){ throw new Error("Invalid question paper id"); }


  const isQuestionPaperExist = await QuestionPaperModel.findOne({ _id: convertQPId, isDeleted: false });
  if (!isQuestionPaperExist) {
    throw new Error("Question paper not found");
  }
  
  const mcqId = await idGenerator.mcqIdGenerator(id);
  mcq.mcqId = mcqId;
  
  const result = await QuestionPaperModel.updateOne(
    { _id: convertQPId, isDeleted: false },
    {
      $push: { MCQSet: mcq },
    }
  );
  const convertId = idConverter(id);
  if (!convertId) {
    throw new Error("Id is not valid");
  }

  await questionPaperUtil.totalMarksCalculator(convertId);
  return result;
};

// export const removeMCQFromQuestionPaper = async (
//   examineeId: string,
//   qpid: string,
//   mcqId: string
// ) => {
//   const isQuestionPaperExist = await QuestionPaperModel.findOne({
//     id: qpid,
//     examineeId,
//     isDeleted: false,
//   });
//   if (!isQuestionPaperExist) {
//     throw new Error("Question paper not found");
//   }
//   if (isQuestionPaperExist.examineeId !== examineeId) {
//     throw new Error("unauthorized access");
//   }
//   const result = await QuestionPaperModel.updateOne(
//     { examineeId, id: qpid, isDeleted: false },
//     {
//       $pull: {
//         MCQSet: {
//           mcqId,
//         },
//       },
//     }
//   );

//   await questionPaperUtil.totalMarksCalculator(qpid);

//   return result;
// };

export const updateQuestionPaper = async (id: string, payload: any) => {
  const result = await QuestionPaperModel.updateOne(
    { id, isDeleted: false },
    {
      duration: payload.duration,
      MCQSet: payload.MCQSet,
    }
  );
  return result;
};

// examinee
export const deleteQuestionPaper = async (qid: string) => {
  const result = await QuestionPaperModel.updateOne(
    { id: qid, isDeleted: false },
    { isDeleted: true }
  );
  return result;
};

const questionPaperService = {
  getAllQuestionPapers,
  getQuestionPapersOfExaminee,
  deleteQuestionPaper,
  updateQuestionPaper,
  createQuestionPaper,
  getSingleQuestionPaper,
  addMCQIntoQuestionPaper,
  // removeMCQFromQuestionPaper,
};
export default questionPaperService;