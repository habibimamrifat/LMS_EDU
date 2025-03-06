import mongoose, { Schema } from 'mongoose';
import { TCourse } from './course.interface';

const courseSchema = new Schema(
  {
    GId: { type: String, required: true },
    courseId: { type: String, required: true, unique: true },
    courseName: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    milestoneList: { type: [Schema.Types.ObjectId], ref: 'Milestone' },
    isCompleted: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

const Course = mongoose.model<TCourse>('Course', courseSchema);

export default Course;
