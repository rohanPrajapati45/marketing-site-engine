import express from 'express';
import {
  getBranches,
  getAllBranches,
  createBranch,
  updateBranch,
  deleteBranch,
  reorderBranches,
} from '../../controllers/contactPage/branchController.js';

const router = express.Router();

// PUBLIC
router.get('/', getBranches);

// ADMIN
router.get('/all', getAllBranches);
router.post('/', createBranch);
router.patch('/reorder', reorderBranches); // must be before /:id
router.put('/:id', updateBranch);
router.delete('/:id', deleteBranch);

export default router;