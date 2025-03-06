import express from 'express';
import { replyController } from './reply.controller';
import validator from '../../util/validator';
import { replyValidationSchema } from './reply.validation';
import auth from '../../middlewares/auth';
import { userRole } from '../../constents';

const router = express.Router();

// Route to create a new reply
router.post('/create-reply', validator(replyValidationSchema), auth(userRole.student, userRole.instructer, userRole.admin), replyController.createReplyIntoDb);

// Route to get all replies for a specific comment
router.get('/replies/:commentId', replyController.getRepliesByCommentIdFromDb);

// Route to update a specific reply
router.put('/:id', replyController.updateReplyFromDb);

// Route to delete a specific reply (soft delete)
router.delete('/:id', replyController.deleteReplyFromDb);

export const replyRoute = router;
