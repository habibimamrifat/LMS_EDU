import mongoose from 'mongoose';
import { z } from 'zod';

// Validation schema for the milestone model
const videoValidationSchema = z.object({
  videoName: z
    .string()
    .min(3, { message: 'Video name must be at least 3 characters.' })
    .max(100, {
      message: 'Video name must be at most 100 characters long.',
    }),
  videoURL: z
    .string()
    .url({ message: 'Invalid video URL format.' })
    .min(1, { message: 'Video URL is required.' }),
  course_id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid Course ObjectId format',
  }),
  milestoneId: z
    .string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: 'Invalid Milestone ObjectId format',
    }),
  moduleId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid Module ObjectId format',
  }),
});

// Validation schema for partial update of the video (makes fields optional)
const partialVideoValidationSchema = videoValidationSchema.partial();

// Export the validation schemas
export { videoValidationSchema, partialVideoValidationSchema };
