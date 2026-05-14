// models/Service.js

import mongoose from "mongoose";

const serviceSchema =
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
        trim: true,
      },

      navTitle: {
        type: String,
        required: true,
        trim: true,
      },

      image: {
        type: String,
        required: true,
      },

      description: {
        type: String,
        required: true,
      },

      items: [
        {
          type: String,
          trim: true,
        },
      ],
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "serviceModel",
  serviceSchema
);