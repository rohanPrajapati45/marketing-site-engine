import mongoose from "mongoose";

const categorySchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },

      subcategories: [
        {
          type:
            mongoose.Schema.Types.ObjectId,

          ref: "SubCategory",
        },
      ],
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "categoryModel",
  categorySchema
);