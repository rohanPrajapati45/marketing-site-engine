import express from 'express';
import {
  getSolutions,
  getAllSolutions,
  createSolution,
  updateSolution,
  deleteSolution,
  reorderSolutions,
} from '../../controllers/solutionsPage/solutionController.js';

const router = express.Router();

// PUBLIC
router.get('/', getSolutions);

// ADMIN
router.get('/all', getAllSolutions);
router.post('/', createSolution);
router.patch('/reorder', reorderSolutions); // must be before /:id
router.put('/:id', updateSolution);
router.delete('/:id', deleteSolution);

export default router;