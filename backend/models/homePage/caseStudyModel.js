import mongoose from 'mongoose';

// ── EMBEDDED SCHEMA for each section inside a case study ──
// Each section = one full screen row (image + text)
// Sections array is flexible — admin adds/removes freely
const csSectionSchema = new mongoose.Schema(
  {
    // Controls display order within this case study
    // Maps to: index in sections[] array
    order: {
      type: Number,
      required: true,
      default: 0,
    },

    // Maps to: className={`cs-section ${section.type}`}
    // Controls whether image is on left or right side
    type: {
      type: String,
      required: true,
      enum: ['image-right', 'image-left'],
      default: 'image-right',
    },

    // Maps to: <h2 className="cs-section-label">{section.label}</h2>
    // Also used as: alt={section.label} on section image
    // Can be any text: 'THE PROBLEM', 'RESULTS', 'OUR APPROACH' etc
    label: {
      type: String,
      required: true,
      trim: true,
    },

    // Maps to: section.points.map() → each as <li>{point}</li>
    // Any number of points — admin adds/removes freely
    points: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length >= 1,
        message: 'At least one point is required per section',
      },
    },

    // Maps to: <img src={section.image} alt={section.label} />
    image: {
      type: String,
      required: true,
    },
  },
  { _id: true }
  // _id: true so each section gets its own ID
  // useful for admin panel to edit/delete individual sections
);

// ── MAIN CASE STUDY SCHEMA ──
const caseStudySchema = new mongoose.Schema(
  {
    // Maps to: useParams() → getCaseStudyBySlug(slug)
    // Must be unique — directly used in URL: /work/omt
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    // Maps to: alt={caseStudy.clientName} on hero image
    // Also used as display name throughout
    clientName: {
      type: String,
      required: true,
      trim: true,
    },

    // Maps to: <h1 className="cs-hero-title">{caseStudy.projectTitle}</h1>
    projectTitle: {
      type: String,
      required: true,
      trim: true,
    },

    // Maps to: <p className="cs-hero-category">{caseStudy.category}</p>
    category: {
      type: String,
      required: true,
      trim: true,
    },

    // Maps to: <img src={caseStudy.heroImage} className="cs-hero-img" />
    // Full viewport hero background image
    heroImage: {
      type: String,
      required: true,
    },

    // Maps to: style={{ background: caseStudy.accentColor }}
    // The 4px colored line below the hero image
    accentColor: {
      type: String,
      required: true,
      default: '#000000',
    },

    // Maps to: <p className="cs-hero-overview">{caseStudy.overview}</p>
    overview: {
      type: String,
      required: true,
      trim: true,
    },

    // Maps to: caseStudy.sections.map() in CaseStudy.jsx
    // Any number of sections — fully flexible
    // Admin can add/remove/reorder sections freely
    sections: {
      type: [csSectionSchema],
      required: true,
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length >= 1,
        message: 'At least one section is required',
      },
    },

    // ── VISIBILITY ──
    // Admin can hide without deleting
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// ── INDEX ──
// Slug is queried on every page load via useParams
caseStudySchema.index({ slug: 1 });

export default mongoose.model('CaseStudy', caseStudySchema);