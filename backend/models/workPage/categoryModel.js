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
      subcategory : [
        {
          type:
            mongoose.Schema.Types.ObjectId,
            
            ref: "subcategoryModel",
            required: false,
        }
      ]
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "categoryModel",
  categorySchema
);