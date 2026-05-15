import mongoose from "mongoose";

const Max5LinerSchema = new mongoose.Schema(
  {
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    },

    cards: [
      {
        lines: {
          type: [String],
          validate: {
            validator: function (arr) {
              return arr.length <= 5;
            },
            message: "A card can have at most 5 lines.",
          },
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

export default mongoose.model("Max5Liner", Max5LinerSchema);