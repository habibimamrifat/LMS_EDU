import mongoose from 'mongoose';
import { z } from 'zod';

// Validation schema for the milestone model
const milestoneValidationSchema = z.object({
  milestoneId: z
    .string()
    .min(1, { message: 'Milestone ID is required.' })
    .max(50, { message: 'Milestone ID must be at most 50 characters long.' }),
  milestoneName: z
    .string()
    .min(3, { message: 'Milestone name must be at least 3 characters.' })
    .max(100, {
      message: 'Milestone name must be at most 100 characters long.',
    }),
  course_id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId format',
  }),
  moduleList: z
    .array(
      z
        .string()
        .min(1, { message: 'Module name must be at least 1 character.' }),
    )
    .nonempty({ message: 'Module list cannot be empty.' }),
});

// Validation schema for partial update of the milestone (makes fields optional)
const partialMilestoneValidationSchema = milestoneValidationSchema.partial();

// Export the validation schemas
export { milestoneValidationSchema, partialMilestoneValidationSchema };
