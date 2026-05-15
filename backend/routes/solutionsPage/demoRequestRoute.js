import express from 'express';
import {
  submitDemoRequest,
  getDemoRequests,
  getDemoRequestById,
  markDemoRequestAsRead,
  archiveDemoRequest,
  deleteDemoRequest,
  bulkDeleteDemoRequests,
  getDemoRequestStats,
} from '../../controllers/solutionsPage/demoRequestController.js';

const router = express.Router();

// PUBLIC — frontend submits demo request
router.post('/', submitDemoRequest);

// ADMIN — list demo requests with pagination
router.get('/', getDemoRequests);

// ADMIN — statistics
router.get('/stats', getDemoRequestStats); // must be before /:id

// ADMIN — individual demo request
router.get('/:id', getDemoRequestById);
router.patch('/:id/read', markDemoRequestAsRead);
router.patch('/:id/archive', archiveDemoRequest);
router.delete('/:id', deleteDemoRequest);

// ADMIN — bulk operations
router.delete('/', bulkDeleteDemoRequests);

export default router;