import express from 'express';
import {
  submitContactForm,
  getContactSubmissions,
  getSubmissionById,
  markAsRead,
  archiveSubmission,
  deleteSubmission,
  bulkDeleteSubmissions,
  getSubmissionStats,
} from '../../controllers/contactPage/contactSubmissionController.js';

const router = express.Router();

// PUBLIC — frontend submits form
router.post('/', submitContactForm);

// ADMIN — list all submissions with pagination + filters
router.get('/', getContactSubmissions);

// ADMIN — statistics dashboard
router.get('/stats', getSubmissionStats); // must be before /:id

// ADMIN — individual submission
router.get('/:id', getSubmissionById);
router.patch('/:id/read', markAsRead);
router.patch('/:id/archive', archiveSubmission);
router.delete('/:id', deleteSubmission);

// ADMIN — bulk operations
router.delete('/', bulkDeleteSubmissions);

export default router;