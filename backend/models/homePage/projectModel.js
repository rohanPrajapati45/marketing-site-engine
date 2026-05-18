import mongoose from 'mongoose';

const homeProjectSchema = new mongoose.Schema(
  {
    // ── ORDER ──
    // Admin drags to reorder — this controls display sequence
    // Also used to generate section id="project-1" in frontend
    order: {
      type: Number,
      required: true,
      default: 0,
    },

    // ── VISIBILITY ──
    // Admin can hide a project without deleting it
    active: {
      type: Boolean,
      default: true,
    },

    // ── LEFT SIDE HEADING ──
    // Maps to: <strong>{project.titleBold}</strong>
    titleBold: {
      type: String,
      required: true,
      trim: true,
    },

    // Maps to: project.titleLines.map() → each rendered as <p>{line}</p>
    // Array of strings — admin can add/remove lines
    titleLines: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length >= 1,
        message: 'At least one title line is required',
      },
    },

    // ── CLIENT LOGO ──
    // Maps to: <img src={project.clientLogo} alt={project.clientLogoAlt}
    //               className="client-logo" />
    clientLogo: {
      type: String,
      default: '',
    },
    clientLogoAlt: {
      type: String,
      default: '',
    },

    // ── CLIENT INFO ──
    // Maps to: <span className="client-name">{project.clientName}</span>
    clientName: {
      type: String,
      required: true,
      trim: true,
    },

    // Maps to: {project.clientCountry && (
    //   <span className="client-country">{project.clientCountry}</span>
    // )}
    // Empty string = not rendered — same behaviour as frontend
    clientCountry: {
      type: String,
      default: '',
    },

    // ── BACKGROUND IMAGE ──
    // Maps to: <img src={project.mockupImage}
    //               alt={project.mockupAlt}
    //               className="slide-bg" />
    // This image covers the entire section as background
    mockupImage: {
      type: String,
      required: true,
    },
    mockupAlt: {
      type: String,
      default: '',
    },

    // ── CASE STUDY LINK ──
    // Maps to: <a href={project.caseStudyUrl} className="btn-case-study">
    caseStudyUrl: {
      type: String,
      required: true,
      default: '/work',
    },
  },
  {
    timestamps: true,
  }
);

// ── INDEX ──
// Always return projects sorted by order field
homeProjectSchema.index({ order: 1 });

export default mongoose.model('HomeProject', homeProjectSchema);