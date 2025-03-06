import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/auth';
import { accessRequest, userRole } from '../../constents';
import assignmentController from './assignment.controller';
import accessAuth from '../../middlewares/accessAuth';
// import assignmentController from "./assignment.controller";

const router = express.Router();

router.get(
  '/getSingleAssignment',
  auth(userRole.student, userRole.instructer),
  accessAuth(accessRequest.assignment),
  assignmentController.getSingleAssignment,
);

router.post(
  '/createAssignment',
  auth(userRole.instructer),
  assignmentController.createAssignment,
);

router.post(
  '/submitAssignment',
  auth(userRole.student),
  assignmentController.submitAssignment,
);

router.get(
  '/getSingleSubmitedAssignment',
  auth(userRole.student, userRole.instructer),
  assignmentController.getSingleSubmitredAssignment,
);

router.patch(
  '/markSubmitedAssignment',
  auth(userRole.instructer),
  assignmentController.markASubmitedAssignment,
);

const assignmentRoutes = router;

export default assignmentRoutes;
