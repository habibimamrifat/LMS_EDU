import express from "express";
import { startExam, submitExam } from "./candidate.controller";

const router = express.Router();

router.post("/startExam", startExam);
router.post("/endExam", submitExam);

const candidateRoutes = router;

export default candidateRoutes;
