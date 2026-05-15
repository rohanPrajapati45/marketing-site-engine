import mongoose from 'mongoose';

// ── EMBEDDED: each form field ──
// Maps to: formData.fields.map() split into two rows:
//   slice(0,3) → form-row-3 (3 columns)
//   slice(3)   → form-row-2 (company + message)
const formFieldSchema = new mongoose.Schema(
  {
    // Controls field position in the form
    order: {
      type: Number,
      required: true,
      default: 0,
    },

    // Maps to: name={field.name} on <input>
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Maps to: placeholder={field.placeholder} on <input>
    placeholder: {
      type: String,
      required: true,
      trim: true,
    },

    // Maps to: type={field.type} on <input>
    type: {
      type: String,
      required: true,
      enum: ['text', 'email', 'number', 'tel', 'textarea'],
      default: 'text',
    },

    // Maps to: layout logic in frontend
    // cols: 1 → normal column width
    // cols: 2 → spans wider column (like message field)
    cols: {
      type: Number,
      enum: [1, 2],
      default: 1,
    },

    // Whether this field is required on submit
    required: {
      type: Boolean,
      default: false,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  { _id: true }
);

const contactFormSchema = new mongoose.Schema(
  {
    // Maps to: <h2 className="form-heading"><b>{formData.heading}</b></h2>
    heading: {
      type: String,
      required: true,
      default: "Let's Transform",
    },

    // Maps to: formData.paragraphs.map() → each as <p>{line}</p>
    // Admin adds/removes paragraph lines freely
    paragraphs: {
      type: [String],
      default: [
        'Like What You See? Tell us about your project.',
        "We don't just build your digital business, we accelerate it!",
        'Best Web and Mobile Apps development company in Lebanon',
      ],
    },

    // Maps to: formData.fields.map() → renders all <input> elements
    // Admin adds/removes fields — order controls row position
    fields: {
      type: [formFieldSchema],
      default: [],
    },

    // Maps to: <span>{formData.submitText}</span> on submit button
    submitText: {
      type: String,
      default: 'SUBMIT',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('ContactForm', contactFormSchema);