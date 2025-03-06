import catchAsync from '../../util/catchAsync';
import sendResponse from '../../util/sendResponse';
import httpStatus from 'http-status';
import { postService } from './post.service';

// Create a new post
const createPostIntoDb = catchAsync(async (req, res) => {
  const reqBody = req.body;

  const result = await postService.createPostIntoDb(reqBody);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Post added successfully',
    data: result,
  });
});

// Get all post
const getAllPostsFromDb = catchAsync(async (req, res) => {
  const query = req.query;

  const result = await postService.getAllPostsFromDb(query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Posts retrieved successfully',
    data: result,
  });
});

const getPostByIdFromDb = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await postService.getPostByIdFromDb(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Post retrieved successfully',
    data: result,
  });
});

const updatePostFromDb = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const result = await postService.updatePostFromDb(id, updateData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Post updated successfully',
    data: result,
  });
});

const deletePostFromDb = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await postService.deletePostFromDb(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Post deleted successfully',
    data: result,
  });
});

export const postController = {
  createPostIntoDb,
  getAllPostsFromDb,
  getPostByIdFromDb,
  updatePostFromDb,
  deletePostFromDb,
};
