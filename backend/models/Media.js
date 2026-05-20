import mongoose from 'mongoose';

// Stores every image uploaded through the CMS
// Linked to Cloudinary — url is the Cloudinary secure_url
const mediaSchema = new mongoose.Schema(
  {
    // Cloudinary secure URL — used everywhere in frontend
    url: {
      type: String,
      required: true,
    },

    // Cloudinary public_id — needed for deletion
    publicId: {
      type: String,
      required: true,
      unique: true,
    },

    // Which section this image belongs to
    // Matches Cloudinary folder structure
    folder: {
      type: String,
      required: true,
      enum: [
        'hero',
        'projects',
        'casestudies',
        'solutions',
        'contact',
        'general',
      ],
      default: 'general',
    },

    // Original filename for display in Media Library
    originalName: {
      type: String,
      default: '',
    },

    // File size in bytes
    size: {
      type: Number,
      default: 0,
    },

    // Image dimensions
    width:  { type: Number, default: 0 },
    height: { type: Number, default: 0 },

    // Format: jpg, png, webp etc.
    format: {
      type: String,
      default: '',
    },

    // Alt text for accessibility
    altText: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    // createdAt used for sorting in Media Library
  }
);

// Index for fast folder filtering
mediaSchema.index({ folder: 1, createdAt: -1 });

export default mongoose.model('Media', mediaSchema);
