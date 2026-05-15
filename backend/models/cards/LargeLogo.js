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
        image: {
          type: String,
          required: true,
          validate: {
            validator: function (v) {
              return v.toLowerCase().endsWith(".png");
            },
            message: "Only .png images are allowed.",
          },
        },
        link:{
            type:String,
            required:true,
        },
        order: {
          type: Number,
          required: true,
        },

        active: {
          type: Boolean,
          default: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("LargeLogo", LargeLogoSchema);