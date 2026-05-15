import mongoose from "mongoose";

const UniqueCardSchema = new mongoose.Schema(
  {
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    },

    cards: [
      {
        title: {
          type: String,
          required: true,
        },

        icon: {
          type: String,
          required: true,
          validate: {
            validator: function (v) {
              return v.toLowerCase().endsWith(".svg");
            },
            message: "Only .svg icons are allowed.",
          },
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("UniqueCard", UniqueCardSchema);