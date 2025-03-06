import { accessRequest} from "../../constents";
import { isExamWithinDuration } from "../../util/checkDuration";
import idConverter from "../../util/idConvirter";
import { QuestionPaperModel } from "../questionPaper/questionPaper.model";
import { StudentModel } from "../user/user.model";
import { ExamType } from "./exam.interface";
import { examModel } from "./exam.model";
import updateProgressforQuizOrAssignment from "../../util/updateProgressforQuizOrAssignment";


export const startExam = async (userId: string, payload: ExamType) => {

  
  console.log(typeof(userId), typeof(payload.questionPaperId));


  const candidateIdConverted = idConverter(userId);
  const questionPaperIdConverted = idConverter(payload.questionPaperId as string);
  
  // Ensure that payload has the correct structure
  const updatePayload = {
    ...payload,
    candidateId: candidateIdConverted,
  };

  const isQuestionPaper = await QuestionPaperModel.findOne({ _id: questionPaperIdConverted });

  if (!isQuestionPaper) {
    throw new Error("Question Paper not found");
  }

  // Create the exam record
  const exam = await examModel.create(updatePayload);



  const updateStudent = await StudentModel.findOneAndUpdate(
    { user: candidateIdConverted }, 
    { $addToSet: { attentedQuiz: questionPaperIdConverted } }, 
    { new: true }
  );
  console.log(updateStudent)


  if (!updateStudent) {
    throw new Error("Failed to update student attendance");
  }

  return {
    exam,
    mcq: isQuestionPaper?.MCQSet.map((e) => {
      return {
        id: e.mcqId,
        question: e.question,
        options: e.options,
        mark: e.mark,
      };
    }),
  };
};

export const endExam = async (candidateId: string, questionPaperId: string, payload: any) => {
  const candidateIdConverted = idConverter(candidateId);
  const questionPaperIdConverted = idConverter(questionPaperId);

  if(!candidateIdConverted || !questionPaperIdConverted)
  {
    throw Error("!candidateIdConverted || !questionPaperIdConverted went missing")
  }

  // Find the exam based on candidateId and questionPaperId
  const isSubmitedBefore = await examModel.findOne(
    {
      candidateId: candidateIdConverted, 
      questionPaperId: questionPaperIdConverted,
      isSubmitted:true
    },
    
  );

  if(isSubmitedBefore)
  {
    throw Error ("previously submited cant submit again")
  }


  // Find the exam based on candidateId and questionPaperId
  const exam = await examModel.findOneAndUpdate(
    {
      candidateId: candidateIdConverted, 
      questionPaperId: questionPaperIdConverted,
    },
    { isSubmitted: payload.isSubmitted, endTime: payload.endTime, answerSheet: payload.answerSheet },
    { new: true }
  );

  if (!exam) {
    throw new Error("Exam not found");
  }

  // Find the question paper
  const questionPaper = await QuestionPaperModel.findOne({ _id: questionPaperIdConverted });

  if (!questionPaper || !questionPaper.MCQSet || questionPaper.MCQSet.length === 0) {
    throw new Error("Question paper not found or has no MCQs.");
  }

  // Check if the exam was completed within the allowed duration
  if (
    !isExamWithinDuration(
      `${exam.startTime}`,
      `${exam.endTime}`,
      questionPaper.duration || 0
    )
  ) {
    throw new Error("Time exceeded");
  }

  // Initialize acquired marks and report sheet
  let acquiredMark = 0;
  const reportSheet: {
    questionId: string;
    correctAnswer: number;
    studentAnswer: number | null;
  }[] = [];

  // Debug: Log incoming answerSheet
  console.log("Received answerSheet:", payload.answerSheet);

  // Process answer sheet and calculate acquired marks
  for (const answer of questionPaper.MCQSet) {
    const studentAnswer = payload.answerSheet.find((e: any) => e.mcqId === answer.mcqId);

    if (studentAnswer) {
      console.log(`Checking MCQ: ${answer.mcqId}, Student Answer: ${studentAnswer.answer}, Correct Answer: ${answer.correctAns}`);

      if (Number(studentAnswer.answer) === Number(answer.correctAns)) {
        acquiredMark += answer.mark; // Award marks for correct answers
      }

      reportSheet.push({
        questionId: answer.mcqId,
        correctAnswer: answer.correctAns,
        studentAnswer: studentAnswer.answer,
      });
    } else {
      // Student did not answer this question
      reportSheet.push({
        questionId: answer.mcqId,
        correctAnswer: answer.correctAns,
        studentAnswer: null,
      });
    }
  }

  // Debug: Log acquired marks before updating the DB
  console.log(`Total Acquired Marks: ${acquiredMark}`);

  // Update the acquired marks in the exam record
  await examModel.updateOne(
    { candidateId: candidateIdConverted, questionPaperId: questionPaperIdConverted },
    { acquiredMark }
  );

  await updateProgressforQuizOrAssignment(candidateIdConverted,questionPaper.GId,accessRequest.quiz,questionPaper.course_id)

  // Return the final results
  return {
    acquiredMark,
    totalMarks: questionPaper.totalMarks,
    reportSheet,
  };
};
