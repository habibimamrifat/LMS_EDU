import catchAsync from "../../util/catchAsync";
import { ExamType } from "./exam.interface";
import {
    endExam,
    startExam
} from "./exam.service";

export const startExamController = catchAsync(async (req, res) => {
    const user_id = req.user.id as string
    const payload = req.body as ExamType


    console.log("dfghdfs",user_id, payload)
    req.body.startTime = parseInt(req.body.startTime, 10)

    const result = await startExam(user_id, payload)


    res.send({
        message: "Exam created successfully",
        success: true,
        status: 200,
        body: result,
    })
})


export const endExamController = catchAsync(async (req, res) => {
    const candidateId = req.user.id as string
    const payload = req.body
    const result = await endExam(candidateId, payload.questionPaperId, payload)

    res.send({
        message: "Exam updated successfully",
        success: true,
        status: 200,
        body: result,
    })
})