import Blog from "../../models/blogPage/blog.js";



// GET BLOGS
export const getPublicBlogs =
  async (req, res) => {
    try {

      const page =
        Number(req.query.page) || 1;

      const { sectionId } = req.query;

      const limit = 6;

      const skip =
        (page - 1) * limit;

      const filter = {
        isPublished: true,
        ...(sectionId ? { sectionId } : {}),
      };

      const totalBlogs =
        await Blog.countDocuments(filter);

      const blogs =
        await Blog.find(filter)
          .sort({
            publishedAt: -1,
          })
          .skip(skip)
          .limit(limit);

      return res.status(200).json({
        success: true,

        data: blogs,

        pagination: {
          currentPage: page,
          totalPages: Math.ceil(
            totalBlogs / limit
          ),
        },
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
};



// GET SINGLE PUBLIC BLOG
export const getPublicBlogBySlug =
  async (req, res) => {
    try {

      const blog =
        await Blog.findOne({
          slug: req.params.slug,
          isPublished: true,
        });

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