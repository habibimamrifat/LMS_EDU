import { Types } from "mongoose";

// Enrollment Status
export type TEnrollmentStatus = "pending" | "paid" | "completed" | "cancelled";

// Enrollment interface for managing the relationship between a student and their course enrollment
export type TEnrollment = {
    student: Types.ObjectId; // Reference to the student
    course: Types.ObjectId;  // Reference to the course
    enrollmentDate: Date;
    paymentStatus: boolean;  // Indicates if the student has paid for the course
    enrollmentStatus: TEnrollmentStatus; // Status of the enrollment process
    isDeleted: boolean; // Soft delete flag for the enrollment record
}