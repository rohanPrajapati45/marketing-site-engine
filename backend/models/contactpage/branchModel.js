import mongoose from 'mongoose';

const branchSchema = new mongoose.Schema(
  {
    // ── ORDER ──
    // Controls display sequence + which card is card-active
    // Maps to: index === activeCityIndex in frontend
    order: {
      type: Number,
      required: true,
      default: 0,
    },

    // ── VISIBILITY ──
    active: {
      type: Boolean,
      default: true,
    },

    // Maps to: <p className="branch-city">{branch.city}</p>
    // Also used as: alt={branch.city} on hero-slide img
    city: {
      type: String,
      required: true,
      trim: true,
    },

    // Maps to: <img src={branch.cityImage} alt={branch.city} />
    // Inside .hero-slide — full viewport background image
    cityImage: {
      type: String,
      required: true,
    },

    // Maps to: branch.addressLines.map() → each as <p>{line}</p>
    // Inside .branch-address — admin adds/removes lines freely
    addressLines: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length >= 1,
        message: 'At least one address line is required',
      },
    },

    // Maps to: <a href={`tel:${branch.phone}`} className="branch-phone">
    // Phone shown inside the white branch card
    phone: {
      type: String,
      required: true,
      trim: true,
    },

    // Maps to: <a href={branch.mapsUrl} target="_blank"> Directions </a>
    mapsUrl: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Always return branches sorted by order
branchSchema.index({ order: 1 });

export default mongoose.model('Branch', branchSchema);