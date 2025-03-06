import express from "express"
import authController from "./auth.controller"
import validator from "../../util/validator"
import { logInValidator } from "./auth.validatot"
import auth from "../../middlewares/auth";
import { userRole } from "../../constents";

const authRouter = express.Router();

authRouter.post("/logIn",validator(logInValidator),authController.logIn)
authRouter.post("/logOut",auth(userRole.admin, userRole.instructer, userRole.student, userRole.user) ,authController.logOut)

export default authRouter;
