// src/hooks/homeData.js
// Remove hardcoded sections[] — now built dynamically in Home.jsx
// Keep only typedTexts and typingPrefix

export const typedTexts = [
  "E-Commerce Solutions",
  "Mobile Applications",
  "Fintech Platforms",
  "Brand Identity",
  "UI/UX Design",
  "Healthcare Technology",
  "AI & Data Intelligence",
];

export const typingPrefix = "For";

// ── sections[] REMOVED from here ──
// It is now built dynamically in Home.jsx
// based on how many projects come from API
// This means 2 projects → 4 sections total
// This means 7 projects → 9 sections total
// hero and cta are always first and last