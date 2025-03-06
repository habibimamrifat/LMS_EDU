import mongoose from 'mongoose';
import { z } from 'zod';

// Validation schema for the milestone model
const moduleValidationSchema = z.object({
  moduleName: z
    .string()
    .min(3, { message: 'Module name must be at least 3 characters.' })
    .max(100, {
      message: 'Module name must be at most 100 characters long.',
    }),
    course_id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid Course ObjectId format',
  }),
  milestoneId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid Milestone ObjectId format',
  }),
});

// Validation schema for partial update of the milestone (makes fields optional)
const partialModuleValidationSchema = moduleValidationSchema.partial();

// Export the validation schemas
export { moduleValidationSchema, partialModuleValidationSchema };
