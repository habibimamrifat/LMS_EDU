import express from 'express';
import { courseController } from './course.controller';
import auth from '../../middlewares/auth';
import { userRole } from '../../constents';

const router = express.Router();

router.post('/create-course', auth(userRole.admin), courseController.createCourseIntoDb);

router.get('/all-courses', courseController.getAllCoursesFromDb);

router.get('/single-course/:id', courseController.getCourseByIdFromDb);

router.put('/update-course/:id', courseController.updateCourseFromDb);

router.put('/delete-course/:id', courseController.deleteCourseFromDb);

router.get('/allMilestonesByCourseId', courseController.allMilestonesByCourseIdFromDb);

export const courseRoute = router;
