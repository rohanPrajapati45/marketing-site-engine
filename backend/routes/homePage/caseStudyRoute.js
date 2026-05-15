import express from 'express';
import {
  getCaseStudyBySlug,
  getAllCaseStudies,
  getCaseStudyById,
  createCaseStudy,
  updateCaseStudy,
  deleteCaseStudy,
} from '../../controllers/homePage/caseStudyController.js';

const router = express.Router();

// PUBLIC — matches getCaseStudyBySlug(slug) in frontend
router.get('/:slug', getCaseStudyBySlug);

// ADMIN
router.get('/admin/all', getAllCaseStudies);
router.get('/admin/:id', getCaseStudyById);
router.post('/', createCaseStudy);
router.put('/:id', updateCaseStudy);
router.delete('/:id', deleteCaseStudy);

export default router;