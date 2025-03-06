import mongoose from 'mongoose';
import { z } from 'zod';

export const replyValidationSchema = z.object({
  body: z.object({
    commentId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: 'Invalid Comment ObjectId format',
    }),
    description: z.string().min(1, { message: 'Description is required' }),
    isDeleted: z.boolean().optional(),
  }),
});
