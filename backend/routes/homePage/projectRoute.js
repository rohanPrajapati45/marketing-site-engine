import express from 'express';
import {
  getProjects,
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects,
} from '../../controllers/homePage/projectController.js';

const router = express.Router();

// PUBLIC
router.get('/', getProjects);

// ADMIN
router.get('/all', getAllProjects);
router.post('/', createProject);
router.patch('/reorder', reorderProjects); // must be before /:id
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;