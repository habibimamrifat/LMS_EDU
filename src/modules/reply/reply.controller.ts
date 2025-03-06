import catchAsync from '../../util/catchAsync';
import sendResponse from '../../util/sendResponse';
import httpStatus from 'http-status';
import { replyService } from './reply.service';

// Create a new reply
const createReplyIntoDb = catchAsync(async (req, res) => {
  const reqBody = req.body;
  
  const result = await replyService.createReplyIntoDb(reqBody);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Reply created successfully',
    data: result,
  });
});

// Get all replies for a specific comment
const getRepliesByCommentIdFromDb = catchAsync(async (req, res) => {
  const { commentId } = req.params;
  
  const result = await replyService.getRepliesByCommentIdFromDb(commentId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Replies fetched successfully',
    data: result,
  });
});

// Update a specific reply
const updateReplyFromDb = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  
  const result = await replyService.updateReplyFromDb(id, updateData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Reply updated successfully',
    data: result,
  });
});

// Soft delete a specific reply
const deleteReplyFromDb = catchAsync(async (req, res) => {
  const { id } = req.params;
  
  const result = await replyService.deleteReplyFromDb(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Reply deleted successfully',
    data: result,
  });
});

export const replyController = {
  createReplyIntoDb,
  getRepliesByCommentIdFromDb,
  updateReplyFromDb,
  deleteReplyFromDb,
};
