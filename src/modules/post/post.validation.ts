import { z } from 'zod';

export const postValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, { message: 'Title is required' }),
    type: z.enum(
      ['Course Topics', 'Bugs', 'Guideline', 'Feature Request', 'Others'],
      {
        message: 'Invalid post type',
      },
    ),
    platform: z.enum(
      ['Website', 'Android APP', 'IOS APP', 'Desktop APP', 'IOS (Browser)'],
      {
        message: 'Invalid platform type',
      },
    ),
    content: z.string().min(1, { message: 'Content is required' }),
    media: z.object({
      photoUrl: z.array(z.string().url().optional()).default([]),
      videoUrl: z.array(z.string().url().optional()).default([]),
      commentList: z.array(z.string()).default([]),
    }),
  }),
});
