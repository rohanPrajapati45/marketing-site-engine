import express from "express";

import {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
} from "../../controllers/blogPage/adminBlogController.js";

const blogRouter = express.Router();

blogRouter.get(
  "/blogs",
  getAllBlogs
);

blogRouter.get(
  "/blogs/:blogId",
  getSingleBlog
);

blogRouter.post(
  "/blogs",
  createBlog
);

blogRouter.put(
  "/blogs/:blogId",
  updateBlog
);

blogRouter.delete(
  "/blogs/:blogId",
  deleteBlog
);

export default blogRouter;