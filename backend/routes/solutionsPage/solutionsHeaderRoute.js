import express from 'express';
import {
  getSolutionsHeader,
  updateSolutionsHeader,
} from '../../controllers/solutionsPage/solutionsHeaderController.js';

const router = express.Router();

// PUBLIC
router.get('/', getSolutionsHeader);

// ADMIN
router.put('/', updateSolutionsHeader);

export default router;