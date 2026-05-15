import mongoose from 'mongoose';

// ── Stores every form submission from the contact page ──
// Admin views these in the admin panel
// Fields are flexible — stored as mixed to handle
// dynamic form fields admin may add/remove
const contactSubmissionSchema = new mongoose.Schema(
  {
    // ── CORE FIELDS ──
    // These always exist — match default form fields

    // Maps to: field name="name"
    name: {
      type: String,
      trim: true,
      default: '',
    },

    // Maps to: field name="email"
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },

    // Maps to: field name="phone_number"
    phone: {
      type: String,
      trim: true,
      default: '',
    },

    // Maps to: field name="company"
    company: {
      type: String,
      trim: true,
      default: '',
    },

    // Maps to: field name="message"
    message: {
      type: String,
      trim: true,
      default: '',
    },

    // ── EXTRA FIELDS ──
    // If admin adds custom fields to the form,
    // their values are stored here as key-value pairs
    // So no submission data is ever lost
    extraFields: {
      type: Map,
      of: String,
      default: {},
    },

    // ── ADMIN STATUS ──
    // Admin marks submissions as read in panel
    read: {
      type: Boolean,
      default: false,
    },

    // Admin can archive old submissions
    archived: {
      type: Boolean,
      default: false,
    },

    // Which page the form was submitted from
    // Useful if same form is reused on other pages
    source: {
      type: String,
      default: 'contact-page',
    },
  },
  {
    timestamps: true,
    // createdAt = submission date/time shown in admin
  }
);

// ── INDEXES ──
// Most common admin queries
contactSubmissionSchema.index({ read: 1 });
contactSubmissionSchema.index({ createdAt: -1 });
contactSubmissionSchema.index({ archived: 1 });

export default mongoose.model('ContactSubmission', contactSubmissionSchema);