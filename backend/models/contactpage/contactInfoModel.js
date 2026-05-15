import mongoose from 'mongoose';

// ── EMBEDDED: each email row ──
// Maps to: contactInfo.emails.map() → <p className="hero-email-row">
//   {email.label}: <a href="mailto:{email.value}">{email.value}</a>
const emailSchema = new mongoose.Schema(
  {
    order: { type: Number, default: 0 },

    // Maps to: {email.label}:
    label: {
      type: String,
      required: true,
      trim: true,
    },

    // Maps to: <a href={`mailto:${email.value}`}>{email.value}</a>
    value: {
      type: String,
      required: true,
      trim: true,
    },

    active: { type: Boolean, default: true },
  },
  { _id: true }
);

// ── EMBEDDED: each phone row ──
// Maps to: contactInfo.phones.map() → <div className="hero-phone-row">
//   <span>{phone.icon === 'phone' ? '📞' : '📱'}</span>
//   <a href={`tel:${phone.value}`}>{phone.value}</a>
const phoneSchema = new mongoose.Schema(
  {
    order: { type: Number, default: 0 },

    // Maps to: phone.icon === 'phone' ? '📞' : '📱'
    // Only two valid values matching frontend logic
    icon: {
      type: String,
      required: true,
      enum: ['phone', 'mobile'],
      default: 'phone',
    },

    // Maps to: <a href={`tel:${phone.value}`}>{phone.value}</a>
    value: {
      type: String,
      required: true,
      trim: true,
    },

    active: { type: Boolean, default: true },
  },
  { _id: true }
);

const contactInfoSchema = new mongoose.Schema(
  {
    // Maps to: <h1 className="hero-heading">{contactInfo.heading}</h1>
    heading: {
      type: String,
      required: true,
      default: "Let's Talk",
    },

    // Maps to: contactInfo.emails.map()
    emails: {
      type: [emailSchema],
      default: [],
    },

    // Maps to: contactInfo.phones.map()
    phones: {
      type: [phoneSchema],
      default: [],
    },

    // Maps to: href="https://wa.me/96170727000"
    // Store only the number — frontend prepends https://wa.me/
    whatsappNumber: {
      type: String,
      required: true,
      default: '96170727000',
    },

    // Maps to: src="/images/contact/whatsapp.svg"
    whatsappIcon: {
      type: String,
      default: '/images/contact/whatsapp.svg',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('ContactInfo', contactInfoSchema);