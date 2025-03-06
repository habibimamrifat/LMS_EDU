import { Schema, model } from 'mongoose';
import { TVideo } from './video.interface';

// Schema for the milestone data
const videoSchema = new Schema<TVideo>({
  GId: {
    type: String,
    required: [true, 'Milestone GId is required'],
  },
  videoId: {
    type: String,
    required: [false, 'Video ID is required'],
  },
  videoName: {
    type: String,
    required: [true, 'Video name is required'],
  },
  videoURL: {
    type: String,
    required: [true, 'Video name is required'],
  },
  course_id: {
    type: Schema.Types.ObjectId,
    required: [true, 'Course ID is required'],
  },
  milestoneId: {
    type: Schema.Types.ObjectId,
    required: [true, 'Milestone ID is required'],
  },
  moduleId: {
    type: Schema.Types.ObjectId,
    required: [true, 'Module ID is required'],
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
  timestamps:true
});

// Export the video model
export const VideoModel = model<TVideo>('Video', videoSchema);
