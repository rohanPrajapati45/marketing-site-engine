import express from "express";

import {
  getNavigation,
} from "../controllers/navigationController.js";

const navigationRouter = express.Router();

// GET NAVIGATION
navigationRouter.get(
  "/navigation",
  getNavigation
);

export default navigationRouter;