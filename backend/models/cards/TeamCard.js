import mongoose from "mongoose";

const TeamCardSchema = new mongoose.Schema(
  {
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    },

    cards: [
      {
        name: {
          type: String,
          required: true,
        },

        role: {
          type: String,
          required: true,
        },

        image: {
          type: String,
          required: true,
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

export default mongoose.model("TeamCard", TeamCardSchema);