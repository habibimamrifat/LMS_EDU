import { Schema, model } from 'mongoose';
import { TAssignment, TSubmittedAssignment } from './assignment.interface';

// Define the Assignment schema
const assignmentSchema = new Schema<TAssignment>(
  {
    GId: {
      type: String,
      required: true,
    },
    assignmentGId: {
      type: String,
      required: false, // Optional field
    },
    course_id: {
      type: Schema.Types.ObjectId,
      ref: 'Course', // Assuming you have a Course model, replace with the correct model name
      required: true,
    },
    milestoneId: {
      type: Schema.Types.ObjectId,
      ref: 'Milestone', // Assuming you have a Milestone model, replace with the correct model name
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    detail: {
      type: String,
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // This will automatically create createdAt and updatedAt fields
  },
);

const SubmittedAssignmentSchema = new Schema<TSubmittedAssignment>(
  {
    assignment_id: {
      type: Schema.Types.ObjectId,
      ref: 'Assignment',
      required: true,
    },
    assignmentLink:{type: String, required:true},

    student_id: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    totalMark: { type: Number, required: true },
    achievedMark: { type: Number, required: true, default:0 }, // Fixed name typo
  },
  { timestamps: true },
);



export const SubmittedAssignmentModel = model<TSubmittedAssignment>('SubmittedAssignment',SubmittedAssignmentSchema);
export const AssignmentModel = model<TAssignment>('Assignment', assignmentSchema);




