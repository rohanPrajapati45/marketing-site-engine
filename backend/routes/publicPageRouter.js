import express from "express";

import {
  getPublicPage,
} from "../controllers/publicPageController.js";

const publicRouter = express.Router();



// GET PUBLIC PAGE BY SLUG
router.get("/pages/:slug", getPublicPage);



export default publicRouter;
