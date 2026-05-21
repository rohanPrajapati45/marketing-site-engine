import mongoose from "mongoose";

const socialLinkSchema = new mongoose.Schema({
  platform: {
    type: String,
    required: true,
    trim: true,
  },
  url: {
    type: String,
    required: true,
    trim: true,
  },
  // Icon type: determines how the icon is rendered
  // "svg-path" = uses svgPath d= attribute (original method)
  // "svg-markup" = full SVG code pasted by admin
  // "image" = image URL (PNG/JPG/WebP)
  iconType: {
    type: String,
    enum: ["svg-path", "svg-markup", "image"],
    default: "svg-path",
  },
  svgPath: {
    type: String,
    default: "",
  },
  svgViewBox: {
    type: String,
    default: "0 0 24 24",
  },
  svgWidth: {
    type: String,
    default: "24",
  },
  svgHeight: {
    type: String,
    default: "24",
  },
  svgTransform: {
    type: String,
    default: "",
  },
  // Full SVG markup (for svg-markup iconType)
  svgMarkup: {
    type: String,
    default: "",
  },
  // Image URL (for image iconType)
  imageUrl: {
    type: String,
    default: "",
  },
  isMultiPath: {
    type: Boolean,
    default: false,
  },
  multiPaths: [
    {
      d: String,
      fill: String,
      stroke: String,
      strokeWidth: String,
      strokeLinecap: String,
      strokeLinejoin: String,
      transform: String,
    },
  ],
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const footerSettingsSchema = new mongoose.Schema(
  {
    socialLinks: [socialLinkSchema],
    copyrightText: {
      type: String,
      default: "Copyrights © 2026 - TEDMOB SAL ALL RIGHTS RESERVED.",
    },
    showLogo: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Singleton pattern — always returns the single document
footerSettingsSchema.statics.getSingleton = function (data = {}) {
  return this.findOneAndUpdate({}, data, {
    upsert: true,
    returnDocument: "after",
    setDefaultsOnInsert: true,
  });
};

const FooterSettings = mongoose.model("FooterSettings", footerSettingsSchema);

export default FooterSettings;
