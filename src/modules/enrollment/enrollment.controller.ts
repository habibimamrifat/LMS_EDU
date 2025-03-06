import { NextFunction, Request, Response } from "express";
import { StudentModel, UserModel } from "../user/user.model";
import { EnrollmentModel } from "./enrollment.model";
import { Stripe } from "stripe";
import mongoose from "mongoose";
import config from "../../config";
import Course from "../course/course.model";
import setProgress from "../../util/setProgress";

const stripe = new Stripe(config.stripe_secret_key);


type StudentDetails = {
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    email: string;
}

export async function enrollment(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
        const { userId, courseId, paymentMethodId, ...studentDetails } = req.body;
        const { firstName, lastName, phone, address, email }: StudentDetails = studentDetails;

        const fullName = `${firstName} ${lastName}`;

        // Fetch the User and Student details
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found." });
        }

        // Update user details
        user.name = fullName;
        user.email = email;
        user.mobileNo = phone;
        await user.save();

        const student = await StudentModel.findOne({ user: new mongoose.Types.ObjectId(userId) });
        if (!student) {
            return res.status(404).json({ success: false, error: "Student not found." });
        }

        // Create a new Enrollment entry with initial status as 'pending'
        const enrollment = new EnrollmentModel({
            student: student.id,
            course: courseId,
            enrollmentStatus: "pending",
            paymentStatus: false,
        });

        await enrollment.save();

        // Populate enrollment with student data and user name
        const populatedEnrollment = await EnrollmentModel.findById(enrollment.id).populate({
            path: "student",
            select: "_id",
            populate: {
                path: "user",
                select: "name email",
            },
        });

        const course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({ success: false, error: "Course not found." });
        }

        // Handle the payment via Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: course?.amount as number,
            currency: "usd",
            payment_method: paymentMethodId,
            payment_method_types: ["card"],
            confirm: true,
            receipt_email: email,
            metadata: { fullName, phone, address },
        });

        await setProgress( courseId , userId);

        // If payment is successful, update the enrollment and student record
        if (paymentIntent.status === "succeeded") {
            // Update student access and progress
            student.courseAccess.push(courseId);
            // student.progress.push({
            //     courseId: courseId,
            //     milestoneNo: 1,
            //     moduleNo: 1,
            //     vedioNo: 1,
            //     lastQuizNo: 0,
            //     lastAssignmentNo: 0,
            // });

            student.paymentStatus = true;
            await student.save();

            // Mark enrollment as paid
            enrollment.paymentStatus = true;
            enrollment.enrollmentStatus = "paid"; // Payment confirmed
            await enrollment.save();

            return res.status(201).json({
                success: true,
                message: "Enrollment successful.",
                populatedEnrollment,
            });
        } else {
            // Handle failed payment
            
            enrollment.enrollmentStatus = "cancelled"; // Payment failed or cancelled
            await enrollment.save();
            return res.status(400).json({ success: false, message: "Payment failed, please try again." });
        }

    } catch (error) {
        next(error);
    }
}