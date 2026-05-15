import mongoose from "mongoose";

const LargeLogoSchema = new mongoose.Schema(
  {
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    },

    cards: [
      {
        photo: {
          type: String,
          required: true,
          validate: {
            validator: function (v) {
              return v.toLowerCase().endsWith(".png");
            },
            message: "Only .png images are allowed.",
          },
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("LargeLogo", LargeLogoSchema);