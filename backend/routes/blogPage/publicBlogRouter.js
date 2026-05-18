import express from "express";

import {
  getPublicBlogs,
  getPublicBlogBySlug,
} from "../../controllers/blogPage/publicBlogController.js";

const blogPublicRouter = express.Router();

blogPublicRouter.get(
  "/blogs",
  getPublicBlogs
);

blogPublicRouter.get(
  "/blogs/:slug",
  getPublicBlogBySlug
);

export default blogPublicRouter;