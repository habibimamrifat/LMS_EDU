import catchAsync from '../../util/catchAsync';
import assigmentServices from './assignment.service';

const createAssignment = catchAsync(async (req, res) => {
  const assignment = req.body;
  const result = await assigmentServices.createAssignment(assignment);

  res.status(200).json({
    success: 'true',
    message: 'assignment has been created',
    data: result,
  });
});

const getSingleAssignment = catchAsync(async (req, res) => {
  const assignment_id = req.query.assignment_id as string;

  const result = await assigmentServices.findAssignment(assignment_id);
  res.status(200).json({
    success: 'true',
    message: 'assignment has been created',
    data: result,
  });
});


const getSingleSubmitredAssignment = catchAsync(async (req, res) => {
  const submitedAssignment_id = req.query.submitedAssignment_id as string;

  const result = await assigmentServices.getSingleSubmitredAssignment(submitedAssignment_id);
  res.status(200).json({
    success: 'true',
    message: 'assignment has been created',
    data: result,
  });
});

const submitAssignment = catchAsync(async (req, res) => {
  const assignment = req.body;
  const studentId = req.user.id;

  const result = await assigmentServices.submitAssignment(
    assignment,
    studentId,
  );

  res.status(200).json({
    success: 'true',
    message: 'assignment has been created',
    data: result,
  });
});

const markASubmitedAssignment = catchAsync(async (req, res) => {
  const submitedAssignment_id = req.query.submitedAssignment_id as string;
  const achievedMark = req.query.achievedMark as string;

  console.log("controller",submitedAssignment_id, achievedMark)

  const result = await assigmentServices.markASubmitedAssignment(
    submitedAssignment_id,
    Number(achievedMark),
  );
  res.status(200).json({
    success: 'true',
    message: 'assignment has been created',
    data: result,
  });
});

const assignmentController = {
  createAssignment,
  getSingleAssignment,
  submitAssignment,
  markASubmitedAssignment,
  getSingleSubmitredAssignment
};
export default assignmentController;
