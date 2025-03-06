import Post from '../post/post.model';
import { TComment } from './comment.interface';
import Comment from './comment.model'; // Assuming you have this model

const createCommentIntoDb = async (commentData: TComment) => {
  // Step 1: Create the comment
  const result = await Comment.create(commentData);

  // Step 2: Find the post associated with the comment
  const findPost = await Post.findById(commentData.postId);
  if (!findPost) {
    throw new Error('Post not found');
  }

  // Step 3: Update the post's commentList by pushing the new comment ID into the array
  const updatedPost = await Post.findByIdAndUpdate(
    { _id: commentData.postId },
    {
      $push: { commentList: result._id }, // Add the new comment ID to the commentList array
    },
    { new: true }
  );

  if (!updatedPost) {
    throw new Error('Failed to update post with comment');
  }

  // Return the created comment
  return result;
};

const getCommentsByPostIdFromDb = async (postId: string) => {
  const result = await Comment.find({ postId,  isDeleted: false }).exec();
  return result;
};

const getCommentByIdFromDb = async (_id: string) => {
  const result = await Comment.findById(_id).exec();
  return result;
};

const updateCommentFromDb = async (_id: string, updateData: Partial<TComment>) => {
  const result = await Comment.findByIdAndUpdate(_id, updateData, {
    new: true,
    runValidators: true,
  }).exec();
  return result;
};

const deleteCommentFromDb = async (_id: string) => {
  // First, find the comment and set isDeleted: true
  const result = await Comment.findByIdAndUpdate(
    _id,
    { isDeleted: true },
    { new: true, runValidators: true }
  );

  if (result) {
    // Then, remove the comment ID from the post's commentList array
    await Post.updateOne(
      { commentList: _id }, // Match the post that has this comment ID
      { $pull: { commentList: _id } } // Remove the comment ID from commentList array
    );
  }

  return result;
};


export const commentService = {
  createCommentIntoDb,
  getCommentsByPostIdFromDb,
  getCommentByIdFromDb,
  updateCommentFromDb,
  deleteCommentFromDb,
};
