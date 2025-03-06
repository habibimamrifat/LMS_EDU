import express from "express"
import userController from "./user.controller"
import { userRole } from "../../constents"
import auth from "../../middlewares/auth"
const userRoutes = express.Router()


userRoutes.post("/createStudent", (req, res,next) => {
    req.body = {
        ...req.body, role: userRole.student
    }
    next()
}, userController.createUser)

userRoutes.post("/createInstructer", (req, res,next) => {
    req.body = {
        ...req.body, role: userRole.instructer
    }
    next()
}, auth(userRole.admin), userController.createUser)

userRoutes.get("/getcurrentProgress", auth(userRole.student), userController.getCurrentProgress)

userRoutes.post("/assignCourse",auth(userRole.admin),userController.assignCourseForInstructor)

userRoutes.get("/getAllStudents", auth(userRole.admin, userRole.instructer), userController.getAllStudents);
userRoutes.get("/getAllInstructors", auth(userRole.admin), userController.getAllInstructors);

userRoutes.put("/updateStudent/:studentId", userController.updateStudent);
userRoutes.put("/updateInstructor/:instructorId", auth(userRole.admin), userController.updateInstructor);

userRoutes.delete("/deleteStudent/:studentId", auth(userRole.admin), userController.deleteStudent);
userRoutes.delete("/deleteInstructor/:instructorId", auth(userRole.admin), userController.deleteInstructor);



export default userRoutes