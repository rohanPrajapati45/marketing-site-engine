import mongoose from "mongoose";

const pageSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
    },

    title: String,

    seo: {
      metaTitle: String,
      metaDescription: String,
      ogImage: String,
    },
    
    isPublished: {
      type: Boolean,
      default: true,
    },

    navTitle: {
      type: String,
      required: true,
      },

    showInNavbar: {
      type: Boolean,
      default: true,
      },

    navOrder: {
      type: Number,
      required: true,
      }
  },
  { timestamps: true }
);

export default mongoose.model("Page", pageSchema);