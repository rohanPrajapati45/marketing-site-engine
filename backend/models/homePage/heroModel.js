import mongoose from 'mongoose';

const heroSchema = new mongoose.Schema(
  {
    // ── HEADING ──
    // Maps to <h2 className="hero-headline"> in Home.jsx
    // 3 separate lines, each rendered with <br /> between them
    headingLine1: {
      type: String,
      required: true,
      default: '"DIGITAL TRANSFORMATION"',
      // renders as: "DIGITAL TRANSFORMATION"
    },
    headingLine2: {
      type: String,
      required: true,
      default: 'full-Service Technology',
      // renders as: full-Service Technology
    },
    headingLine3: {
      type: String,
      required: true,
      default: '& Creative Agency',
      // renders as: & Creative Agency
    },

    // ── TYPING ANIMATION ──
    // Maps to: const typingPrefix = "For"
    typingPrefix: {
      type: String,
      required: true,
      default: 'For',
    },
    // Maps to: const typedTexts = [ ... ] array in Home.jsx
    typedTexts: {
      type: [String],
      required: true,
      default: [
        'E-Commerce Solutions',
        'Mobile Applications',
        'Fintech Platforms',
        'Brand Identity',
        'UI/UX Design',
        'Healthcare Technology',
        'AI & Data Intelligence',
      ],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length >= 1,
        message: 'At least one typed text word is required',
      },
    },

    // ── HERO BACKGROUND VIDEO ──
    // Maps to: <source src="/videos/hero.mp4" type="video/mp4" />
    videoUrl: {
      type: String,
      required: true,
      default: '/videos/hero.mp4',
    },

    // ── SHOWREEL GIF BUTTON ──
    // Maps to: <img src="/images/tedmob-gif.gif" alt="Play Showreel" />
    showreelGif: {
      type: String,
      required: true,
      default: '/images/tedmob-gif.gif',
    },
    // Maps to: <source src="/videos/showreel.mp4" type="video/mp4" />
    showreelVideo: {
      type: String,
      required: true,
      default: '/videos/showreel.mp4',
    },
    // Maps to: <small>Play Our </small> <small>Showreel</small>
    showreelLabelLine1: {
      type: String,
      default: 'Play Our',
    },
    showreelLabelLine2: {
      type: String,
      default: 'Showreel',
    },

    // ── SCROLL INDICATOR ──
    // Maps to: <span>Scroll</span> inside .scroll-hint
    scrollLabel: {
      type: String,
      default: 'Scroll',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Hero', heroSchema);