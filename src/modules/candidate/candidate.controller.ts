import catchAsync from "../../util/catchAsync";
import { startExamService, submitExamService } from "./candidate.services";

export const startExam = catchAsync(async (req, res) => {
  const result = startExamService();
  res.status(200).json({
    message: "Exam started successfully",
    status: 200,
    data: result,
  });
});

export const submitExam = catchAsync(async (req, res) => {
  const result = submitExamService();
  res.status(200).json({
    message: "Exam submitted successfully",
    status: 200,
    data: result,
  });
});
