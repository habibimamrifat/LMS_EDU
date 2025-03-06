import { idFor } from '../../constents';
import idConverter from '../../util/idConvirter';
import idGeneratorFunctions from '../../util/idGenarator';
import Course from '../course/course.model';
import { TMilestone } from './milestone.interface';
import { MilestoneModel } from './milestone.model';

// Service for creating a milestone
const createMilestoneIntoDB = async (milestone: TMilestone) => {

  const { course_id } = milestone
  const findCourse = await Course.findById({ _id: course_id })
  if (!findCourse) {
    throw Error("no such course found")
  }

  const modifiedModel = idGeneratorFunctions.asDocumentModel(MilestoneModel)
  const genaratedId = await idGeneratorFunctions.collectionIdGenerator(modifiedModel, idFor.milestone, course_id)
  console.log("milestone id is fetched",genaratedId)

  console.log("milestone",milestone)

  const updateMilestone = {
    ...milestone,
    courseGId: findCourse.GId,
    GId: genaratedId,
    milestoneId: genaratedId,
  }
  const result = await MilestoneModel.create(updateMilestone);

  if(!result)
  {
    throw Error ("milestone Creation failed")
  }

  const updateCourseWithMileStone_id = await Course.findByIdAndUpdate({_id:course_id},
    {
      $push:{
        milestoneList:result._id
      }
    },
    {new:true}
  )
  return result;
};

// Service for getting all milestones or searching by a value
const getAllMilestonesFromDB = async (searchTerm: object): Promise<TMilestone[] | null> => {
  const result = await MilestoneModel.find(searchTerm);
  return result;
};

// Service for retrieving a single milestone
const getSingleMilestoneFromDB = async (_id: string) => {
  const result = await MilestoneModel.findOne({ _id });
  return result;
};

// Service for deleting a milestone
const deleteMilestoneFromDB = async (_id: string) => {
  const result = await MilestoneModel.findByIdAndUpdate(
    { _id },
    { isDeleted: true },
    { new: true, runValidators: true }
  );
  return result;
};

// Service for updating a milestone
const updateMilestoneFromDB = async (
  _id: string,
  updateData: Partial<TMilestone>
) => {
  try {
    const result = await MilestoneModel.findOneAndUpdate(
      { _id },
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).exec();
    return result;
  } catch (error) {
    console.error(`Failed to update milestone with id ${_id}:`, error);
    throw error;
  }
};

const allModuleByMilestoneId = async (_id: string) => {
  try {
    // Fetch the milestone by ID and populate the moduleList field
    const milestone = await MilestoneModel.findById(_id)
      .populate('moduleList'); // Populate the moduleList field with Module documents

    if (!milestone) {
      console.log("Milestone not found with the given ID:", _id);
      return null;  // Return null if milestone is not found
    }

    return milestone;  // Return the populated milestone
  } catch (error) {
    console.error("Error fetching milestone with ID", _id, error);
    throw new Error('Failed to fetch milestone');
  }
};

// Exporting the main service for use in controllers
export const MilestoneServices = {
  createMilestoneIntoDB,
  getAllMilestonesFromDB,
  getSingleMilestoneFromDB,
  deleteMilestoneFromDB,
  updateMilestoneFromDB,
  allModuleByMilestoneId
};
