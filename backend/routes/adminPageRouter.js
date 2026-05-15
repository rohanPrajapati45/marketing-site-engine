import express from "express";

import {
  getAllPages,
  getSinglePage,
  createPage,
  updatePage,
  deletePage,
} from "../controllers/adminPageController.js";

const adminRouter = express.Router();

adminRouter.get("/pages", getAllPages);

adminRouter.get("/pages/:pageId", getSinglePage);

adminRouter.post("/pages", createPage);

adminRouter.put("/pages/:pageId", updatePage);

adminRouter.delete("/pages/:pageId", deletePage);

export default adminRouter;
