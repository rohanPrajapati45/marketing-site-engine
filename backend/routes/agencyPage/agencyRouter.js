import express from "express";

import {
  getAgencySections,
  createAgencySection,
  updateAgencySection,
  deleteAgencySection,
} from "../controllers/agencyController.js";

const agnecyRouter = express.Router();



// GET ALL SECTIONS
agnecyRouter.get("/pages/agency", getAgencySections);



// CREATE SECTION
agnecyRouter.post("/pages/agency", createAgencySection);



// UPDATE SECTION
agnecyRouter.put("/pages/agency/:sectionId", updateAgencySection);



// DELETE SECTION
agnecyRouter.delete("/pages/agency/:sectionId", deleteAgencySection);


export default agencyRouter;

