import Blog from "../../models/blogPage/blog.js";



// CREATE BLOG
export const createBlog =
  async (req, res) => {
    try {

      const blog =
        await Blog.create(req.body);

      return res.status(201).json({
        success: true,
        data: blog,
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
};



// GET ALL BLOGS
export const getAllBlogs =
  async (req, res) => {
    try {

      const { sectionId } = req.query;

      const filter = sectionId ? { sectionId } : {};

      const blogs =
        await Blog.find(filter)
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        data: blogs,
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
};



// GET SINGLE BLOG
export const getSingleBlog =
  async (req, res) => {
    try {

      const blog =
        await Blog.findById(
          req.params.blogId
        );

      if (!blog) {
        return res.status(404).json({
          success: false,
          message: "Blog not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: blog,
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
};



// UPDATE BLOG
export const updateBlog =
  async (req, res) => {
    try {

      const blog =
        await Blog.findByIdAndUpdate(
          req.params.blogId,
          req.body,
          {
            new: true,
          }
        );

      return res.status(200).json({
        success: true,
        data: blog,
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
};



// DELETE BLOG
export const deleteBlog =
  async (req, res) => {
    try {

      await Blog.findByIdAndDelete(
        req.params.blogId
      );

      return res.status(200).json({
        success: true,
        message:
          "Blog deleted successfully",
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
};