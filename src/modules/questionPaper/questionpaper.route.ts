import express from "express";
import auth from "../../middlewares/auth";
import { userRole } from "../../constents";
import questionPaperController from "./questionPaper.controller";


const router = express.Router();



router.post("/createQuestionPaper", auth(userRole.instructer), questionPaperController.createQuestionPaper);
router.patch("/addNewMCQ", auth(userRole.instructer), questionPaperController.addMCQIntoQuestionPaper);

router.get("/getSingleQuestionPaper", questionPaperController.getSingleQuestionPaper);

router.patch("/:qid", auth(userRole.instructer), questionPaperController.updateQuestionPaper);
router.delete("/:qid", auth(userRole.instructer), questionPaperController.deleteQuestionPaper);

const questionPaperRoutes = router;

export default questionPaperRoutes;
