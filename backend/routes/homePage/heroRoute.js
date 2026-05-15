import express from 'express';
import {
  getHero,
  updateHero,
} from '../../controllers/homePage/heroController.js';

const router = express.Router();

// PUBLIC
router.get('/', getHero);

// ADMIN — add auth middleware later: router.put('/', authMiddleware, updateHero)
router.put('/', updateHero);

export default router;