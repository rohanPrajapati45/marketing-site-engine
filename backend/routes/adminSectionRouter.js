import express from "express";

import {
  createSection,
  updateSection,
  deleteSection,
} from "../controllers/adminSectionController.js";

const sectionRouter = express.Router();


// CREATE SECTION
sectionRouter.post("/pages/:pageId/sections", createSection);

// UPDATE SECTION
sectionRouter.put("/sections/:sectionId", updateSection);

// DELETE SECTION
sectionRouter.delete("/sections/:sectionId", deleteSection);


export default sectionRouter;

