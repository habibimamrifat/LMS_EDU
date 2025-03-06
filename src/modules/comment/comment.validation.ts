import mongoose from 'mongoose';
import { z } from 'zod';

export const commentValidationSchema = z.object({
  body: z.object({
    postId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: 'Invalid Post ObjectId format',
      }),
    description: z.string().min(1, { message: 'Description is required' }),
    replyList: z.array(z.string()).default([]),
    isDeleted: z.boolean().default(false),
  }),
});
