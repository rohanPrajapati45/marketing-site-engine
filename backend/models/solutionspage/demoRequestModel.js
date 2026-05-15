import mongoose from 'mongoose';

// ── Stores every demo request submitted from SolutionSection forms ──
// Each solution section has a phone + email form
// Admin views these in admin panel grouped by solution
const demoRequestSchema = new mongoose.Schema(
  {
    // Which solution this request came from
    // Maps to: solution.title used in alert(`Demo requested for ${solution.title}`)
    solutionTitle: {
      type: String,
      required: true,
      trim: true,
    },

    // Reference to which solution document
    solutionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Solution',
      default: null,
    },

    // Maps to: <input type="tel" placeholder="Phone Number" />
    // Hardcoded input in SolutionSection.jsx — always present
    phone: {
      type: String,
      required: true,
      trim: true,
    },

    // Maps to: <input type="email" placeholder="Email" />
    // Hardcoded input in SolutionSection.jsx — always present
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    // ── ADMIN STATUS ──
    read: {
      type: Boolean,
      default: false,
    },

    archived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    // createdAt = submission time shown in admin panel
  }
);

// ── INDEXES ──
demoRequestSchema.index({ read: 1 });
demoRequestSchema.index({ createdAt: -1 });
demoRequestSchema.index({ solutionId: 1 });

export default mongoose.model('DemoRequest', demoRequestSchema);