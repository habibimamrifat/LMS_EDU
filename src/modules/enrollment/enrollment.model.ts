import mongoose, { Schema, Types } from "mongoose";

const EnrollmentSchema = new Schema({
    student: { type: Types.ObjectId, required: true, ref: "StudentCollection" }, // Reference to the Student model
    course: { type: Types.ObjectId, required: true, ref: "Course" }, // Reference to the Course model
    enrollmentDate: { type: Date, required: true, default: Date.now }, // Date when the enrollment was created
    paymentStatus: { type: Boolean, required: true, default: false }, // Indicates if the student has made the payment
    enrollmentStatus: { 
        type: String, 
        enum: ["pending", "paid", "completed", "cancelled"], 
        default: "pending" 
    }, // The status of the enrollment
    isDeleted: { type: Boolean, default: false }, // Soft delete flag for this enrollment
});

// Model to interact with the Enrollment collection in the database
export const EnrollmentModel = mongoose.model("EnrollmentCollection", EnrollmentSchema);