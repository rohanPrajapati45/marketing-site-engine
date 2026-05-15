import mongoose from 'mongoose';

const solutionSchema = new mongoose.Schema(
  {
    // ── ORDER ──
    // Controls display sequence on page
    // Maps to: solutionsData.map() order in Solutions.jsx
    order: {
      type: Number,
      required: true,
      default: 0,
    },

    // ── VISIBILITY ──
    // Admin hides without deleting
    active: {
      type: Boolean,
      default: true,
    },

    // ── THEME ──
    // Maps to: className={`solution-section theme-${solution.theme}`}
    // Controls background: dark=#1a1a1a / light=#f5f5f5
    // Also controls input border, tag border, button colors
    theme: {
      type: String,
      required: true,
      enum: ['dark', 'light'],
      default: 'dark',
    },

    // ── LEFT SIDE CONTENT ──

    // Maps to: <h2 className="solution-title">{solution.title}</h2>
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Maps to: <p className="solution-description">{solution.description}</p>
    description: {
      type: String,
      required: true,
      trim: true,
    },

    // Maps to: <p className="solution-inquiry-label">{solution.inquiryLabel}</p>
    // Small label above phone/email inputs
    inquiryLabel: {
      type: String,
      default: 'For more inquiry fill the below',
      trim: true,
    },

    // Maps to: <span>{solution.buttonText}</span> inside .btn-request-demo
    buttonText: {
      type: String,
      default: 'Request Demo',
      trim: true,
    },

    // Maps to: used on form submit redirect
    // Currently alert() — will become redirect when backend connected
    buttonLink: {
      type: String,
      default: '/contact',
      trim: true,
    },

    // ── RIGHT SIDE — IMAGE CAROUSEL ──
    // Maps to: solution.images.map() inside .carousel-track
    // Each string = one carousel slide image path
    // Admin adds/removes images — any count works
    // alt text auto-generated: `${solution.title} ${i + 1}`
    images: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length >= 1,
        message: 'At least one image is required',
      },
    },

    // ── TAGS STRIP — below carousel ──
    // Maps to: solution.tags.map()
    // → each as <span className="solution-tag">{tag}</span>
    // Admin adds/removes tags freely — any count works
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Always return solutions sorted by order
solutionSchema.index({ order: 1 });

export default mongoose.model('Solution', solutionSchema);