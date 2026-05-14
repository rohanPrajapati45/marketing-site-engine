import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema(
  {
    page: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Page",
    },

    type: {
      type: String,
      required: true,
    },

    order: {
      type: Number,
      required: true,
    },

    enabled: {
      type: Boolean,
      default: true,
    },

    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Section", sectionSchema);