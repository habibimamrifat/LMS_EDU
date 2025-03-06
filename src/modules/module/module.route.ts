import express from 'express';
import { ModuleControllers } from './module.controller';
import auth from '../../middlewares/auth';
import { userRole } from '../../constents';

const router = express.Router();

// Route to create or post a new module
router.post('/create-module', auth(userRole.admin, userRole.instructer), ModuleControllers.createModule);

// Route to get all module
router.get('/all-modules', ModuleControllers.getAllModules);

// Route to get a single module
router.get('/:moduleId', ModuleControllers.getSingleModule);

// Route to delete a single module
router.delete('/:moduleId', ModuleControllers.deleteModule);

// Route to update a single module
router.put('/:moduleId', ModuleControllers.updateModule);

// Route to fetch all videos by module ID
router.get('/allVideosByModuleId/:_id', ModuleControllers.allVideosByModuleIdFromDb);

export const ModuleRoute = router;
