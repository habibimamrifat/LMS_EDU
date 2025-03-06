import catchAsync from '../../util/catchAsync';
import sendResponse from '../../util/sendResponse';
import { courseService } from './course.service';
import httpStatus from 'http-status';

// Create a new course
const createCourseIntoDb = catchAsync(async (req, res) => {
  const reqBody = req.body;

  const result = await courseService.createCourseIntoDb(reqBody);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Course added successfully',
    data: result,
  });
});

// Get all courses
const getAllCoursesFromDb = catchAsync(async (req, res) => {
  const query = req.query;

  const result = await courseService.getAllCoursesFromDb(query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Courses retrieved successfully',
    data: result,
  });
});

const getCourseByIdFromDb = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await courseService.getCourseByIdFromDb(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Course retrieved successfully',
    data: result,
  });
});

const updateCourseFromDb = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const result = await courseService.updateCourseFromDb(id, updateData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Course updated successfully',
    data: result,
  });
});

const deleteCourseFromDb = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await courseService.deleteCourseFromDb(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Course deleted successfully',
    data: result,
  });
});

const allMilestonesByCourseIdFromDb = catchAsync(async (req, res) => {
  const id  = req.query.course_id as string;
  
  const result = await courseService.allMilestonesByCourseId(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'All milestones by course fetch successfully',
    data: result,
  });
})

export const courseController = {
  createCourseIntoDb,
  getAllCoursesFromDb,
  getCourseByIdFromDb,
  updateCourseFromDb,
  deleteCourseFromDb,
  allMilestonesByCourseIdFromDb
};
