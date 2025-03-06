import express from 'express';
import { postController } from './post.controller';
import validator from '../../util/validator';
import { postValidationSchema } from './post.validation';
import auth from '../../middlewares/auth';
import { userRole } from '../../constents';

const router = express.Router();

router.post('/create-post', validator(postValidationSchema), auth(userRole.student, userRole.instructer, userRole.admin), postController.createPostIntoDb);

router.get('/all-posts', postController.getAllPostsFromDb);

router.get('/:id', postController.getPostByIdFromDb);

router.put('/:id', postController.updatePostFromDb);

router.delete('/:id', postController.deletePostFromDb);

export const postRoute = router;
