import mongoose, { Schema } from 'mongoose';
import { TReply } from './reply.interface';  // Assuming you have this file for TReply

const replySchema = new Schema(
  {
    commentId: { type: Schema.Types.ObjectId, ref: 'Comment', required: true },  // Reference to Comment
    description: { type: String, required: true },  // Content of the reply
    isDeleted: { type: Boolean, default: false },  // Soft delete flag for reply
  },
  { timestamps: true, versionKey: false },  // Automatically add createdAt and updatedAt fields
);

// Create a model from the schema
const Reply = mongoose.model<TReply>('Reply', replySchema);

export default Reply;
