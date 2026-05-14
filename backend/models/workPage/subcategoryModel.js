// models/SubCategory.js

import mongoose from "mongoose";

const subCategorySchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      category: [
          {
            type:
              mongoose.Schema.Types.ObjectId,
  
              ref: "categoryModel",
              required: true,

          },
        ],
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "subcategoryModel",
  subCategorySchema
);