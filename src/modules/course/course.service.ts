import { TCourse } from './course.interface';
import Course from './course.model';
import idGeneratorFunctions from '../../util/idGenarator';
import { idFor } from '../../constents';

const createCourseIntoDb = async (courseData: TCourse) => {
  const modifyModel = idGeneratorFunctions.asDocumentModel(Course)
  const genaretredId =await idGeneratorFunctions.collectionIdGenerator(modifyModel, idFor.course)
  // console.log(genaretredId)
  const modifyCourseData = {...courseData, courseId:genaretredId, GId:genaretredId}
  const result = await Course.create(modifyCourseData);
  return result;
};


const getAllCoursesFromDb = async (query: Record<string, unknown>) => {
  const courseQuery = Course.find(query);
  const result = await courseQuery.exec();
  return result;
};

const getCourseByIdFromDb = async (_id: string) => {
  const result = await Course.findById(_id).exec();
  return result;
};

const updateCourseFromDb = async (
  _id: string,
  updateData: Partial<TCourse>,
) => {
  const result = await Course.findByIdAndUpdate(_id, updateData, {
    new: true,
    runValidators: true,
  }).exec();
  return result;
};

const deleteCourseFromDb = async (_id: string) => {
  const result = await Course.findByIdAndUpdate(
    { _id },
    { isDeleted: true },
    { new: true, runValidators: true },
  );
  return result;
};

const allMilestonesByCourseId = async ( _id: string ) => {
  const result = await Course.findById( _id ).populate('milestoneList');

  console.log(result);

  return result;
}

export const courseService = {
  createCourseIntoDb,
  getAllCoursesFromDb,
  getCourseByIdFromDb,
  updateCourseFromDb,
  deleteCourseFromDb,
  allMilestonesByCourseId
};
