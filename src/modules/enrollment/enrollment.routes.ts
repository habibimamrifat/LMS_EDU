import express, { NextFunction, Request, Response } from "express"
import { EnrollmentModel } from "./enrollment.model";
import mongoose from "mongoose";
import { enrollment } from "./enrollment.controller";
const enrollRoutes = express.Router()



enrollRoutes.post("/enroll", enrollment)



export default enrollRoutes ;





// const studentId = "507f1f77bcf86cd799439011";  // Example valid ObjectId string
//     const courseId = "507f1f77bcf86cd799439012";  // Example valid ObjectId string

//     // Ensure the ids are valid ObjectIds before creating the enrollment
//     try {
//         if (!mongoose.Types.ObjectId.isValid(studentId)) {
//             throw new Error("Invalid student ID format");
//         }
//         if (!mongoose.Types.ObjectId.isValid(courseId)) {
//             throw new Error("Invalid course ID format");
//         }

//         const newEnrollment = new EnrollmentModel({
//             student: new mongoose.Types.ObjectId(studentId),  // Valid ObjectId conversion
//             course: new mongoose.Types.ObjectId(courseId),    // Valid ObjectId conversion
//             paymentStatus: false,                         // Default payment status
//             enrollmentStatus: "pending",                  // Default enrollment status
//             isDeleted: false,                             // Record not deleted
//         });

//         await newEnrollment.save();

//         res.status(200).json({
//             message: "Enrollment successful",
//         });
//     } catch (error) {
//         res.status(400).json({
//             status: "error",
//             message: error.message || "Something went wrong",
//         });
//     }