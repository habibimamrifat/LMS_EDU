import mongoose from 'mongoose';
import { Request, Response } from 'express';
import catchAsync from '../../util/catchAsync';
import sendResponse from '../../util/sendResponse';
import HttpStatus from 'http-status';
import { partialVideoValidationSchema, videoValidationSchema } from './video.validation';
import { VideoServices } from './video.service';
import { VideoModel } from './video.model';
import { ModuleModel } from '../module/module.model';
import { MilestoneModel } from '../milestone/milestone.model';
import idGeneratorFunctions from '../../util/idGenarator';
import { idFor } from '../../constents';

// Controller to create a video
const createVideo = catchAsync(async (req: Request, res: Response) => {
    const videoData = req.body;
    
    // Validate the input data using your validation schema
    const parsedVideoData = videoValidationSchema.parse(videoData);
  
    // Ensure the courseId, milestoneId, and moduleId are ObjectId (if it's a string, convert it)
    const courseId = new mongoose.Types.ObjectId(parsedVideoData.course_id);
    const milestoneId = new mongoose.Types.ObjectId(parsedVideoData.milestoneId);
    const moduleId = new mongoose.Types.ObjectId(parsedVideoData.moduleId);
  
    // Step 1: Generate videoId (similar to the auto-generation of moduleId and milestoneId)
    const modifiedModel = idGeneratorFunctions.asDocumentModel(VideoModel);
    const generatedVideoId = await idGeneratorFunctions.collectionIdGenerator(modifiedModel, idFor.video, courseId);
    console.log(generatedVideoId);
  
    // Step 2: Prepare the video data
    const updatedVideoData = {
      ...parsedVideoData,
      GId: generatedVideoId,
      videoId: generatedVideoId, // Set the videoId
      course_id: courseId, // Ensure courseId is properly set
      milestoneId, // Ensure milestoneId is properly set
      moduleId, // Ensure moduleId is properly set
    };
    console.log(updatedVideoData);
  
    // Step 3: Create the video
    const result = await VideoServices.createVideoIntoDB(updatedVideoData);
  
    // Step 4: Add the video ID to the module's videoList[] array
    const updateModule = await ModuleModel.findByIdAndUpdate(
      moduleId,
      { $push: { videoList: result._id } }, // Add the video’s ObjectId to the list
      { new: true, runValidators: true }
    );
  
    // Step 5: Optionally, add the video ID to the milestone's videoList[] array
    const updateMilestone = await MilestoneModel.findByIdAndUpdate(
      milestoneId,
      { $push: { videoList: result._id } }, // Add the video’s ObjectId to the milestone’s video list
      { new: true, runValidators: true }
    );
  
    // Step 6: Send the response
    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Video created successfully!',
      data: result,
    });
  });
  

// Controller to get all videos (with optional search term)
const getAllVideos = catchAsync(async (req: Request, res: Response) => {
  const searchTerm = req.query.searchTerm;
  const query: any = {};

  if (searchTerm) {
    query.$or = [
      { videoName: { $regex: searchTerm, $options: 'i' } },
      { moduleId: { $regex: searchTerm, $options: 'i' } },
      { milestoneId: { $regex: searchTerm, $options: 'i' } },
      { courseId: { $regex: searchTerm, $options: 'i' } },
    ];
  }

  const result = await VideoServices.getAllVideosFromDB(query);

  if (!result || result.length === 0) {
    return sendResponse(res, {
      success: false,
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Videos not found!',
      data: null,
    });
  }

  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Videos fetched successfully!',
    data: result,
  });
});

// Controller to get a single video
const getSingleVideo = catchAsync(async (req: Request, res: Response) => {
  const { videoId } = req.params;

  // Call service to get the video by its ID
  const result = await VideoServices.getSingleVideoFromDB(videoId);

  if (!result) {
    // If video not found, send a 404 response
    return sendResponse(res, {
      success: false,
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Video not found!',
      data: null,
    });
  }

  // If video found, send a success response
  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Video fetched successfully!',
    data: result,
  });
});

// Controller to delete a single video
const deleteVideo = catchAsync(async (req: Request, res: Response) => {
  const { videoId } = req.params;

  // Check if the module exists
  const isExist = await VideoServices.getSingleVideoFromDB(videoId);

  if (!isExist) {
    return sendResponse(res, {
      success: false,
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Video not found!',
      data: null,
    });
  }

  await VideoServices.deleteVideoFromDB(videoId);

  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Video deleted successfully!',
    data: null,
  });
});

// Controller to update a video
const updateVideo = catchAsync(async (req: Request, res: Response) => {
  const { videoId } = req.params;
  const updateData = req.body;

  const parsedUpdateData = partialVideoValidationSchema.parse(updateData);

  const result = await VideoServices.updateVideoFromDB(
    videoId,
    parsedUpdateData,
  );

  if (!result) {
    return sendResponse(res, {
      success: false,
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Video not found!',
      data: null,
    });
  }

  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Video updated successfully!',
    data: result,
  });
});

// Exporting video controllers
export const VideoControllers = {
    createVideo,
    getAllVideos,
    getSingleVideo,
    deleteVideo,
    updateVideo,
};
