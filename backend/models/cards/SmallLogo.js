import mongoose from "mongoose";

const SmallLogoSchema = new mongoose.Schema(
  {
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    },

    cards: [
      {
        name:{
            type:String,
            required:true,
        },
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

export default mongoose.model("SmallLogo", SmallLogoSchema);