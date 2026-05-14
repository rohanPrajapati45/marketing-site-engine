// models/Project.js

import mongoose from "mongoose";

const projectSchema =
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
        trim: true,
      },

      image: {
        type: String,
        required: true,
      },

      subcategories: [
        {
          type:
            mongoose.Schema.Types.ObjectId,

          ref: "SubCategory",
        },
      ],

      isComingSoon: {
        type: Boolean,
        default: false,
      },

      isRecentProject: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "projectModel",
  projectSchema
);