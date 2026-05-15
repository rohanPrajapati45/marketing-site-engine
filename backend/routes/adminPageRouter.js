import express from "express";

import {
  getAllPages,
  getSinglePage,
  createPage,
  updatePage,
  deletePage,
} from "../controllers/adminPageController.js";

const adminRouter = express.Router();

adminRouter.get("/admin/pages", getAllPages);

adminRouter.get("/admin/pages/:pageId", getSinglePage);

adminRouter.post("/admin/pages", createPage);

adminRouter.put("/admin/pages/:pageId", updatePage);

adminRouter.delete("/admin/pages/:pageId", deletePage);

export default adminRouter;
