import express from 'express';
import { reorderCards, reorderSections } from '../controllers/utilityController.js';

const utilityRouter = express.Router();

utilityRouter.put(
  "/pages/:pageId/reorder-sections",
  reorderSections
);

utilityRouter.put(
  "/sections/:sectionId/reorder-cards",
  reorderCards
);

export default utilityRouter;
