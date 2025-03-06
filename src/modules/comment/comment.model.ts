import mongoose, { Schema } from 'mongoose';
import { TComment } from './comment.interface'; // Assuming you have this file for TComment

const commentSchema = new Schema(
  {
    postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true }, // reference to Post
    description: { type: String, required: true },
    replyList: { type: [String], default: [] },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

// Create a model from the schema
const Comment = mongoose.model<TComment>('Comment', commentSchema);

export default Comment;
