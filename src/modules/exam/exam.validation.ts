import { z } from "zod";

export const startExam = z.object({
    body: z.object({
        startTime: z.string().min(1),
        questionPaperId: z.string().min(1),
    })
})

export const endExam = z.object({
    body:z.object({
        questionPaperId: z.string(),
        endTime: z.string().min(1),
        isSubmitted: z.boolean(),
        answerSheet: z.array(z.object({
                qid: z.string(),
                answer: z.string()
        }))
    })
})