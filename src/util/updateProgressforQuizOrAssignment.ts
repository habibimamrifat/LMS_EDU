import { Types } from "mongoose";
import { StudentModel } from "../modules/user/user.model";
import { accessCollection, accessRequest } from "../constents";

const updateProgressforQuizOrAssignment = async (
    userId: Types.ObjectId,
    incomingGId: string,
    accessReqFor: accessCollection,
    courseId: Types.ObjectId
  ) => {
    try {
      console.log(courseId);
  
      // Find the student by userId and check progress for the given courseId
      const student = await StudentModel.findOne({ user: userId });
  
      if (!student) {
        throw new Error("Student not found.");
      }
  
      console.log(student?.progress);
  
      // Find the specific progress entry in the progress array for the given courseId
      const progressEntry = student.progress.find((p: any) =>
        p.courseId.toString() === courseId.toString()
      );
  
      if (!progressEntry) {
        throw new Error("No progress found for the given course.");
      }
  
      // Function to increment the last four digits in the string (e.g., "QUI0001" -> "QUI0002")
      const incrementProgress = (progressStr: string) => {
        if (!progressStr) {
          throw new Error("Progress string is empty or invalid.");
        }
  
        const match = progressStr.match(/(\D+)(\d{4})$/); // Match the last 4 digits
        if (!match) throw new Error("Invalid progress format.");
  
        const prefix = match[1]; // e.g., "QUI"
        const number = parseInt(match[2], 10) + 1; // Increment the number by 1
  
        // Ensure the number stays 4 digits by padding with leading zeros if necessary
        return `${prefix}${number.toString().padStart(4, "0")}`;
      };
  
      // Define the update object dynamically
      const updateFields: any = {};
  
      if (accessReqFor === accessRequest.quiz) {
        if (progressEntry.lastQuizNo && progressEntry.moduleNo) {
          updateFields["progress.$.lastQuizNo"] = incrementProgress(progressEntry.lastQuizNo.toString());
          updateFields["progress.$.moduleNo"] = incrementProgress(progressEntry.moduleNo.toString());
        } else {
          throw new Error("Invalid progress values.");
        }
      } else if (accessReqFor === accessRequest.assignment) {
        if (progressEntry.lastAssignmentNo && progressEntry.milestoneNo) {
          updateFields["progress.$.lastAssignmentNo"] = incrementProgress(progressEntry.lastAssignmentNo.toString());
          updateFields["progress.$.milestoneNo"] = incrementProgress(progressEntry.milestoneNo.toString());
        } else {
          throw new Error("Invalid progress values.");
        }
      } else {
        throw new Error("Invalid accessReqFor type.");
      }
  
      // Update the specific progress entry inside the progress array
      const updatedStudent = await StudentModel.findOneAndUpdate(
        { user: userId, "progress.courseId": courseId }, // Match the student and correct course progress
        { $set: updateFields }, // Update specific fields
        { new: true }
      );
  
      if (!updatedStudent) {
        throw new Error("Failed to update student progress.");
      }
  
      return updatedStudent;
    } catch (error: any) {
      console.error("Error updating progress:", error);
      throw error;
    }
  };
    
export default updateProgressforQuizOrAssignment;


