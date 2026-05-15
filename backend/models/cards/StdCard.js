import mongoose from "mongoose";

const StdCardsSchema = new mongoose.Schema(
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

        subTitle: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("StdCard", StdCardsSchema);