import { Schema, model } from 'mongoose';
import { TModule } from './module.interface';

// Schema for the milestone data
const moduleSchema = new Schema<TModule>(
  {
    GId: {
      type: String,
      required: [true, 'Milestone GId is required'],
    },
    moduleId: {
      type: String,
    },
    moduleName: {
      type: String,
      required: [true, 'Module name is required'],
    },
    course_id: {
      type: Schema.Types.ObjectId,
      required: [true, 'Course ID is required'],
    },
    milestoneId: {
      type: Schema.Types.ObjectId,
      required: [true, 'Milestone ID is required'],
    },
    videoList: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Video',
        default: [true, 'Video list is required'],
      },
    ],
    quizId: {
      type: Schema.Types.ObjectId,
      required: false,
      default: null,
    },
    isCompleted: {
      type: Boolean,
      required: [false, 'Completion status is required'],
      default: false,
    },
    isDeleted: {
      type: Boolean,
      required: [false, 'Deleted status is required'],
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Export the module model
export const ModuleModel = model<TModule>('Module', moduleSchema);
