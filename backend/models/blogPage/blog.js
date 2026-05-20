import mongoose from "mongoose";

const blogSchema =
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
        trim: true,
      },

      slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },

      excerpt: {
        type: String,
        required: true,
      },

      coverImage: {
        type: String,
        required: true,
      },

      sectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
        index: true,
      },

      content: {
        type: String,
        required: true,
      },

      category: {
        type: String,
        default: "General",
      },

      tags: [
        {
          type: String,
        },
      ],

      seo: {
        metaTitle: String,
        metaDescription: String,
        ogImage: String,
      },

      isPublished: {
        type: Boolean,
        default: true,
      },

      featured: {
        type: Boolean,
        default: false,
      },

      publishedAt: {
        type: Date,
        default: Date.now,
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "Blog",
  blogSchema
);