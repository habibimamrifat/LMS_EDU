import catchAsync from '../../util/catchAsync';
import sendResponse from '../../util/sendResponse';
import httpStatus from 'http-status';
import { commentService } from './comment.service';
import { UserModel } from '../user/user.model';

// Create a new comment
const createCommentIntoDb = catchAsync(async (req, res) => {
  const reqBody = req.body;
  // console.log(req.user);

  const { id } = req.user;

  // console.log(id);

  const user = await UserModel.findOne({_id : id});

  // console.log(user)

 
  if(!user) {
    throw new Error ("User not found!");
  }
  
  const userName = user.name;
  // console.log(userName, id)

  const commentData = await commentService.createCommentIntoDb(reqBody);

  const result = {
    commentData,     
    userid: id,         
    username: userName,  
  };

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Comment added successfully',
    data: result,
  });
});

// Get all comments for a specific post
const getCommentsByPostIdFromDb = catchAsync(async (req, res) => {
  const { postId } = req.params;

  const result = await commentService.getCommentsByPostIdFromDb(postId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Comments retrieved successfully',
    data: result,
  });
});

// Get a specific comment by ID
const getCommentByIdFromDb = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await commentService.getCommentByIdFromDb(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Comment retrieved successfully',
    data: result,
  });
});

// Update a comment
const updateCommentFromDb = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const result = await commentService.updateCommentFromDb(id, updateData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Comment updated successfully',
    data: result,
  });
});

// Delete a comment (soft delete)
const deleteCommentFromDb = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await commentService.deleteCommentFromDb(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Comment deleted successfully',
    data: result,
  });
});

export const commentController = {
  createCommentIntoDb,
  getCommentsByPostIdFromDb,
  getCommentByIdFromDb,
  updateCommentFromDb,
  deleteCommentFromDb,
};
