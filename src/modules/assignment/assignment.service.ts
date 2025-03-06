import mongoose, { Types } from 'mongoose';
import { MilestoneModel } from '../milestone/milestone.model';
import { TAssignment, TSubmittedAssignment } from './assignment.interface';
import idGeneratorFunctions from '../../util/idGenarator';
import { accessRequest, idFor } from '../../constents';
import idConverter from '../../util/idConvirter';
import { AssignmentModel, SubmittedAssignmentModel } from './assignment.model';
import { StudentModel } from '../user/user.model';
import updateProgressforQuizOrAssignment from '../../util/updateProgressforQuizOrAssignment';

const createAssignment = async (payload: TAssignment) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { course_id, milestoneId } = payload;

    const convertedModel =
      idGeneratorFunctions.asDocumentModel(AssignmentModel);
    const generatedId = await idGeneratorFunctions.collectionIdGenerator(
      convertedModel,
      idFor.assignment,
      course_id,
    );

    //   console.log("Generated ID:", generatedId);

    const milestoneCheck =
      await MilestoneModel.findById(milestoneId).session(session);
    if (!milestoneCheck) {
      throw new Error('Milestone not found');
    }
    if (milestoneCheck.assignmentId) {
      throw new Error('This milestone already has an assignment');
    }

    // Update payload data
    const updatedPayload = {
      ...payload,
      GId: generatedId,
      assignmentGId: generatedId,
    };

    // Create assignment within the transaction
    const result = await AssignmentModel.create([updatedPayload], { session });

    if (!result || result.length === 0) {
      throw new Error('Failed to create assignment');
    }

    // Update milestone with the created assignment ID
    const updateMilestone = await MilestoneModel.findOneAndUpdate(
      { _id: milestoneId },
      { $set: { assignmentId: result[0]._id } },
      { new: true, session },
    );

    if (!updateMilestone) {
      throw new Error('Failed to update milestone');
    }

    // Commit transaction
    await session.commitTransaction();
    return result[0];
  } catch (error: any) {
    // Rollback transaction in case of error
    await session.abortTransaction();
    throw new Error(error.message || 'Error in creating assignment');
  } finally {
    session.endSession();
  }
};

const findAssignment = async (assignment_id: Types.ObjectId | string) => {
  try {
    // Ensure assignment_id is an ObjectId if it's a string
    const id =
      typeof assignment_id === 'string'
        ? idConverter(assignment_id)
        : assignment_id;

    // Search for the assignment in the AssignmentModel
    const result = await AssignmentModel.findById(id);

    if (!result) {
      throw new Error('Assignment not found');
    }

    return result;
  } catch (error: any) {
    throw new Error(error.message || 'Error finding assignment');
  }
};

const getSingleSubmitredAssignment = async (assignment_id: Types.ObjectId | string) => {
  try {
    // Ensure assignment_id is an ObjectId if it's a string
    const id =
      typeof assignment_id === 'string'
        ? idConverter(assignment_id)
        : assignment_id;

    // Search for the assignment in the AssignmentModel
    const result = await SubmittedAssignmentModel.findById(id);

    if (!result) {
      throw new Error('Assignment not found');
    }

    return result;
  } catch (error: any) {
    throw new Error(error.message || 'Error finding assignment');
  }
};

const submitAssignment = async (
  assignment: TSubmittedAssignment,
  studentId: string,
) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { assignment_id } = assignment;
    const convertedStudentId = idConverter(studentId);
    if(!convertedStudentId)
    {
      throw Error ("student Id conversition failed")
    }

    // Check if assignment exists
    const checkAssignment =
      await AssignmentModel.findById(assignment_id).session(session);
    if (!checkAssignment) {
      throw new Error('The assignment is not found');
    }

    // Check if the student has already submitted the assignment
    const reSubmitCheck = await SubmittedAssignmentModel.findOne({
      student_id: convertedStudentId,
      assignment_id: assignment_id,
    }).session(session);
    if (reSubmitCheck) {
      throw new Error(
        "You have already submitted this assignment, can't submit again",
      );
    }

    // Prepare the updated assignment data
    const updateAssignment = {
      ...assignment,
      student_id: convertedStudentId,
      totalMark: checkAssignment.totalMarks,
    };

    // Create the submitted assignment entry
    const result = await SubmittedAssignmentModel.create([updateAssignment], {
      session,
    });

    // Update the student's attended assignments
    const updateStudent = await StudentModel.findOneAndUpdate(
      {user:convertedStudentId},
      {
        $addToSet: {
          attendedAssignment: result[0]._id,
        },
      },
      { new: true, session },
    );

    if (!updateStudent) {
      throw new Error("Failed to update student's attended assignments");
    }
    await updateProgressforQuizOrAssignment(convertedStudentId,checkAssignment.GId,accessRequest.assignment,checkAssignment.course_id )

    // Commit transaction
    await session.commitTransaction();

    

    return result[0];
  } catch (error: any) {
    // Rollback transaction in case of error
    await session.abortTransaction();
    throw new Error(error.message || 'Error submitting assignment');
  } finally {
    session.endSession();
  }
};

const markASubmitedAssignment = async (
  submitedAssignment_id: string,
  achievedMark: number,
) => {

  const convertedAssignmentId = idConverter(submitedAssignment_id);

  const result = await SubmittedAssignmentModel.findByIdAndUpdate(
    convertedAssignmentId,
    {
      $set: {
        achievedMark: achievedMark,
      },
    },
    {
      new: true,
    },
  );

  return result

};

const assigmentServices = {
  createAssignment,
  findAssignment,
  getSingleSubmitredAssignment,
  submitAssignment,
  markASubmitedAssignment
};
export default assigmentServices;
