import Comment from '../comment/comment.model';
import { TReply } from './reply.interface';
import Reply from './reply.model';

// Service to create a new reply
const createReplyIntoDb = async (replyData: TReply) => {
  // Step 1: Create the reply
  const result = await Reply.create(replyData);

  // Step 2: Find the comment associated with the reply
  const findComment = await Comment.findById(replyData.commentId);
  if (!findComment) {
    throw new Error('Comment not found');
  }

  // Step 3: Update the comment's replyList by pushing the new reply ID into the array
  const updatedComment = await Comment.findByIdAndUpdate(
    { _id: replyData.commentId },
    {
      $push: { replyList: result._id }, // Add the new reply ID to the replyList array
    },
    { new: true }
  );

  if (!updatedComment) {
    throw new Error('Failed to update comment with reply');
  }

  // Return the created reply
  return result;
};

// Service to get all replies for a specific comment
const getRepliesByCommentIdFromDb = async (commentId: string) => {
  const result = await Reply.find({ commentId, isDeleted: false }).exec();
  return result;
};

// Service to update a specific reply
const updateReplyFromDb = async (id: string, updateData: Partial<TReply>) => {
  const result = await Reply.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).exec();
  return result;
};

// Service to delete (soft delete) a specific reply
const deleteReplyFromDb = async (id: string) => {
  const result = await Reply.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true, runValidators: true },
  ).exec();

  if(result) {
    await Comment.updateOne(
      { replyList: id },
      { $pull: { replyList: id }}
    )
  }
  return result;
};


export const replyService = {
  createReplyIntoDb,
  getRepliesByCommentIdFromDb,
  updateReplyFromDb,
  deleteReplyFromDb,
};
