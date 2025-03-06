import mongoose, { Schema } from 'mongoose';
import { TPost } from './post.interface';

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ['Course Topics', 'Bugs', 'Guideline', 'Feature Request', 'Others'],
      required: true,
    },
    platform: {
      type: String,
      enum: [
        'Website',
        'Android APP',
        'IOS APP',
        'Desktop APP',
        'IOS (Browser)',
      ],
      required: true,
    },
    content: { type: String, required: true },
    media: {
      photoUrl: { type: [String], default: [] },
      videoUrl: { type: [String], default: [] },
    },
    commentList: { type: [String], default: [] },
    isDeleted: {
      type: Boolean,
      required: [false, 'Deleted status is required'],
      default: false,
    },
  },
  { timestamps: true, versionKey: false },
);

// Create a model from the schema
const Post = mongoose.model<TPost>('Post', postSchema);

export default Post;
