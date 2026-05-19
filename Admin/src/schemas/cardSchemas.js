// Schema-driven form definitions for each card type
// Defines the fields for individual cards within a card-based section
// Each field: { name, type, label, required?, placeholder?, max?, itemType? }

export const cardSchemas = {
  "stat-card": [
    { name: "title", type: "text", label: "Title", required: true, placeholder: "e.g. Projects Delivered" },
    { name: "number", type: "number", label: "Number", required: true, placeholder: "e.g. 150" },
    { name: "lines", type: "array", label: "Lines", itemType: "text", placeholder: "Add a line" },
  ],
  "std-card": [
    { name: "title", type: "text", label: "Title", required: true, placeholder: "Card title" },
    { name: "description", type: "textarea", label: "Description", required: true, placeholder: "Card description" },
  ],
  "team-card": [
    { name: "name", type: "text", label: "Name", required: true, placeholder: "Team member name" },
    { name: "role", type: "text", label: "Role", required: true, placeholder: "e.g. Lead Designer" },
    { name: "image", type: "image", label: "Photo", required: true },
  ],
  "unique-card": [
    { name: "title", type: "text", label: "Title", required: true, placeholder: "Card title" },
    { name: "icon", type: "image", label: "Icon (.svg)", required: true },
  ],
  "max5liner-card": [
    { name: "lines", type: "array", label: "Lines (max 5)", itemType: "text", max: 5, placeholder: "Add a line" },
  ],
  "small-logo-card": [
    { name: "name", type: "text", label: "Name", required: true, placeholder: "Logo name" },
    { name: "image", type: "image", label: "Logo (.png)", required: true },
  ],
  "mid-logo-card": [
    { name: "image", type: "image", label: "Logo (.png)", required: true },
    { name: "link", type: "text", label: "Link URL", required: true, placeholder: "https://..." },
  ],
  "large-logo-card": [
    { name: "image", type: "image", label: "Logo (.png)", required: true },
    { name: "link", type: "text", label: "Link URL", required: true, placeholder: "https://..." },
  ],

  // ── Gallery / Slide-Gallery / CTA card types ──
  "gallery-card": [
    { name: "image", type: "image", label: "Image", required: true },
  ],
  "slide-gallery-card": [
    { name: "image", type: "image", label: "Image", required: true },
    { name: "alt", type: "text", label: "Alt Text", placeholder: "Image description" },
  ],
  "cta-card": [
    { name: "text", type: "text", label: "Button Text", required: true, placeholder: "Company Profile" },
    { name: "link", type: "text", label: "Button Link", required: true, placeholder: "https://example.com/profile.pdf" },
  ],
};
