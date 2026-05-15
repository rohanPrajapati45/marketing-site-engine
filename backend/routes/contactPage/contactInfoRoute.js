import express from 'express';
import {
  getContactInfo,
  updateContactInfo,
} from '../../controllers/contactPage/contactInfoController.js';

const router = express.Router();

// PUBLIC
router.get('/', getContactInfo);

// ADMIN — add auth middleware later: router.put('/', authMiddleware, updateContactInfo)
router.put('/', updateContactInfo);

export default router;