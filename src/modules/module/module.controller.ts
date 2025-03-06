import mongoose from 'mongoose';
import { Request, Response } from 'express';
import catchAsync from '../../util/catchAsync';
import sendResponse from '../../util/sendResponse';
import HttpStatus from 'http-status';
import { moduleValidationSchema, partialModuleValidationSchema } from './module.validation';
import { ModuleServices } from './module.service';
import { MilestoneModel } from '../milestone/milestone.model';
import Course from '../course/course.model';
import idGeneratorFunctions from '../../util/idGenarator';
import { ModuleModel } from './module.model';
import { idFor } from '../../constents';

// Controller to create a module
const createModule = catchAsync(async (req: Request, res: Response) => {
  const moduleData = req.body;
  
  // Validate the input data using your validation schema
  const parsedModuleData = moduleValidationSchema.parse(moduleData);

  // Ensure the courseId and milestoneId are ObjectId (if it's a string, convert it)
  const courseId = new mongoose.Types.ObjectId(parsedModuleData.course_id);
  const milestoneId = new mongoose.Types.ObjectId(parsedModuleData.milestoneId);

  // Step 1: Check if the course exists
  const findCourse = await Course.findById(courseId);
  if (!findCourse) {
    throw new Error("No such course found");
  }

  // Step 2: Generate moduleId (similar to milestoneId generation)
  const modifiedModel = idGeneratorFunctions.asDocumentModel(ModuleModel);
  const generatedModuleId = await idGeneratorFunctions.collectionIdGenerator(modifiedModel, idFor.module, courseId);

  // Step 3: Prepare the module data
  const updatedModuleData = {
    ...parsedModuleData,
    courseGId: findCourse.GId,
    GId: generatedModuleId, // Use the generated moduleId here
    moduleId: generatedModuleId, // Set the moduleId
  };

  // Step 4: Create the module
  const result = await ModuleServices.createModuleIntoDB(updatedModuleData);

  // Step 5: Add the module ID to the milestone's moduleList[] array
  const updateMilestone = await MilestoneModel.findByIdAndUpdate(
    milestoneId,
    { $push: { moduleList: result._id } }, // Add the module's ObjectId to the list
    { new: true, runValidators: true }
  );

  // Step 6: Add the module ID to the course's moduleList[] array
  const updateCourseWithModuleId = await Course.findByIdAndUpdate(
    courseId,
    { $push: { moduleList: result._id } }, // Add the module's ObjectId to the course's moduleList
    { new: true, runValidators: true }
  );

  // Step 7: Send the response
  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.CREATED,
    message: 'Module created successfully!',
    data: result,
  });
});


// Controller to get all modules (with optional search term)
const getAllModules = catchAsync(async (req: Request, res: Response) => {
  const searchTerm = req.query.searchTerm;
  const query: any = {};

  if (searchTerm) {
    query.$or = [
      { moduleName: { $regex: searchTerm, $options: 'i' } },
      { milestoneId: { $regex: searchTerm, $options: 'i' } },
      { courseId: { $regex: searchTerm, $options: 'i' } },
      { videoList: { $regex: searchTerm, $options: 'i' } },
    ];
  }

  const result = await ModuleServices.getAllModulesFromDB(query);

  if (!result || result.length === 0) {
    return sendResponse(res, {
      success: false,
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Modules not found!',
      data: null,
    });
  }

  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Modules fetched successfully!',
    data: result,
  });
});

// Controller to get a single module
const getSingleModule = catchAsync(async (req: Request, res: Response) => {
  const { moduleId } = req.params;

  // Call service to get the modulee by its ID
  const result = await ModuleServices.getSingleModuleFromDB(moduleId);

  if (!result) {
    // If module not found, send a 404 response
    return sendResponse(res, {
      success: false,
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Module not found!',
      data: null,
    });
  }

  // If module found, send a success response
  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Module fetched successfully!',
    data: result,
  });
});

// Controller to delete a single module
const deleteModule = catchAsync(async (req: Request, res: Response) => {
  const { moduleId } = req.params;

  // Check if the module exists
  const isExist = await ModuleServices.getSingleModuleFromDB(moduleId);

  if (!isExist) {
    return sendResponse(res, {
      success: false,
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Module not found!',
      data: null,
    });
  }

  await ModuleServices.deleteModuleFromDB(moduleId);

  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Module deleted successfully!',
    data: null,
  });
});

// Controller to update a module
const updateModule = catchAsync(async (req: Request, res: Response) => {
  const { moduleId } = req.params;
  const updateData = req.body;

  const parsedUpdateData = partialModuleValidationSchema.parse(updateData);

  const result = await ModuleServices.updateModuleFromDB(
    moduleId,
    parsedUpdateData,
  );

  if (!result) {
    return sendResponse(res, {
      success: false,
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Module not found!',
      data: null,
    });
  }

  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Module updated successfully!',
    data: result,
  });
});


// Controller to fetch all videos by module ID
const allVideosByModuleIdFromDb = catchAsync(async (req: Request, res: Response) => {
  const _id = req.params._id; 

  // Call the service to fetch the videos
  const result = await ModuleServices.allVideosByModuleId(_id);

  if (!result) {
    return sendResponse(res, {
      success: false,
      statusCode: HttpStatus.NOT_FOUND,
      message: 'No videos found for the given module',
      data: null,
    });
  }

  return sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: 'All videos by module fetched successfully',
    data: result, 
  });
});

// Exporting module controllers
export const ModuleControllers = {
  createModule,
  getAllModules,
  getSingleModule,
  deleteModule,
  updateModule,
  allVideosByModuleIdFromDb
};
