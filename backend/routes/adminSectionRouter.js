import express from "express";

import {
  createAgencySection,
  updateAgencySection,
  deleteAgencySection,
} from "../controllers/agencyController.js";

const sectionRouter = express.Router();


// CREATE SECTION
agnecyRouter.post("pages/:pageId/sections", createAgencySection);

// UPDATE SECTION
agnecyRouter.put("/sections/:sectionId", updateAgencySection);

// DELETE SECTION
agnecyRouter.delete("/sections/:sectionId", deleteAgencySection);


export default sectionRouter;

