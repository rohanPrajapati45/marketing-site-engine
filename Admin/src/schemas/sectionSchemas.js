// Schema-driven form definitions for each section type
// Matches ACTUAL backend data structures
// Field types: text, textarea, number, image, array, select, toggle, objectArray, json

// ── Human-readable info for each section type (shown to admin) ──
export const sectionTypeInfo = {
  "hero-section": {
    label: "Hero Section",
    description: "Full-width banner at top of page with heading, subtext, background image, and CTA button.",
    icon: "🏠",
  },
  "tagline": {
    label: "Tagline",
    description: "Short highlighted text strip — used for quotes, stats highlights, or brand taglines.",
    icon: "💬",
  },
  "cta": {
    label: "Call to Action",
    description: "Section with heading, description, and a CTA button — drives users to take action.",
    icon: "📢",
  },
  "standard": {
    label: "Standard Section",
    description: "Generic section with heading, subheading, description, and optional image. Supports card layouts.",
    icon: "📄",
  },
  "slide-gallery": {
    label: "Slide Gallery",
    description: "Horizontal auto-scrolling image/logo carousel. Uses cards for each slide item.",
    icon: "🎠",
  },
  "gallery": {
    label: "Gallery",
    description: "Grid-based image gallery section. Uses cards for each gallery item.",
    icon: "🖼️",
  },
  "empty": {
    label: "Empty / Custom",
    description: "Blank section placeholder — used for custom content or spacers.",
    icon: "⬜",
  },
  "project-section": {
    label: "Project Section",
    description: "Showcases featured projects/case studies in a grid or list layout.",
    icon: "🏗️",
  },
  "sticky-services": {
    label: "Sticky Services",
    description: "Services section with sticky scroll effect — items pin and reveal as user scrolls.",
    icon: "📌",
  },
  "work-category-menu": {
    label: "Work Category Menu",
    description: "Tabbed project portfolio with filters by Industry, Region, Service. Controls which projects appear and in what order.",
    icon: "📂",
  },
  "solution-section": {
    label: "Solution Section",
    description: "Product/solution showcase with title, description, image gallery, tags, and demo request button.",
    icon: "💡",
  },
  "contact-hero": {
    label: "Contact Hero",
    description: "Contact page header with email addresses, phone numbers, and branch city tabs.",
    icon: "📞",
  },
  "branch-section": {
    label: "Branch / Office",
    description: "Individual office location card with city, address, phone, and Google Maps link.",
    icon: "📍",
  },
};

// ══════════════════════════════════════════════════════════════
// ── SECTION FIELD SCHEMAS ──
// Maps section.type → section-level fields only (NOT card fields)
// ══════════════════════════════════════════════════════════════
export const sectionSchemas = {
  "hero-section": [
    { name: "headingLine1", type: "text", label: "Heading Line 1", placeholder: "\"DIGITAL TRANSFORMATION\"" },
    { name: "headingLine2", type: "text", label: "Heading Line 2", placeholder: "Full-Service Technology" },
    { name: "headingLine3", type: "text", label: "Heading Line 3", placeholder: "& Creative Agency" },
    { name: "typingPrefix", type: "text", label: "Typing Prefix", placeholder: "For" },
    { name: "typedTexts", type: "array", label: "Typed Texts (rotating)", itemType: "text", placeholder: "e.g. E-Commerce Solutions" },
    { name: "videoUrl", type: "image", label: "Background Video / Image URL" },
    { name: "showreelGif", type: "image", label: "Showreel Preview GIF" },
    { name: "showreelVideo", type: "image", label: "Showreel Video URL" },
    { name: "showreelLabelLine1", type: "text", label: "Showreel Label Line 1", placeholder: "Play Our" },
    { name: "showreelLabelLine2", type: "text", label: "Showreel Label Line 2", placeholder: "Showreel" },
  ],

  "tagline": [
    { name: "title", type: "text", label: "Title", required: true, placeholder: "TEDMOB is a digital experience & technology agency" },
    { name: "subtitle", type: "textarea", label: "Subtitle", placeholder: "A full-service remote design & technology agency..." },
  ],

  "cta": [
    { name: "title", type: "text", label: "Title", required: true, placeholder: "Let's Transform" },
    { name: "subtitle", type: "textarea", label: "Subtitle", placeholder: "Checkout our latest company overview & show reel." },
  ],

  "standard": [
    { name: "title", type: "text", label: "Title", required: true, placeholder: "HOW WE DO IT" },
    { name: "subtitle", type: "text", label: "Subtitle", placeholder: "Our process is designed for successful collaboration." },
  ],

  "slide-gallery": [
    { name: "title", type: "text", label: "Title", placeholder: "JOIN OUR TEAM" },
    { name: "description", type: "textarea", label: "Description", placeholder: "TEDMOB is a dynamic and passionate place to be." },
    { name: "buttonText", type: "text", label: "Button Text", placeholder: "Careers" },
    { name: "buttonLink", type: "text", label: "Button Link", placeholder: "mailto:careers@tedmob.com" },
  ],

  "gallery": [],

  "empty": [
    { name: "height", type: "text", label: "Height", placeholder: "100vh" },
  ],

  "project-section": [
    { name: "titleBold", type: "text", label: "Title Bold", placeholder: "Mobile Banking" },
    { name: "titleLines", type: "array", label: "Title Lines", itemType: "text", placeholder: "e.g. Full-Featured Digital" },
    { name: "clientLogo", type: "image", label: "Client Logo" },
    { name: "clientLogoAlt", type: "text", label: "Client Logo Alt Text", placeholder: "Bokra" },
    { name: "clientName", type: "text", label: "Client Name", placeholder: "BOKRA" },
    { name: "clientCountry", type: "text", label: "Client Country/Region", placeholder: "MENA REGION" },
    { name: "mockupImage", type: "image", label: "Mockup Image" },
    { name: "mockupAlt", type: "text", label: "Mockup Alt Text", placeholder: "Bokra App Mockup" },
    { name: "caseStudyUrl", type: "text", label: "Case Study URL", placeholder: "/work/bokra" },
  ],

  "branch-section": [
    { name: "id", type: "number", label: "Branch ID", required: true, placeholder: "e.g. 1" },
    { name: "city", type: "text", label: "City / Country Name", required: true, placeholder: "e.g. UAE" },
    { name: "addressLines", type: "array", label: "Address Lines", itemType: "text", placeholder: "Add address line" },
    { name: "phone", type: "text", label: "Phone Number", placeholder: "+971 50 1234567" },
    { name: "mapsUrl", type: "text", label: "Google Maps URL", placeholder: "https://www.google.com/maps/place/..." },
  ],

  "contact-hero": [
    { name: "contactInfo.heading", type: "text", label: "Contact Heading", required: true, placeholder: "Let's Talk" },
    {
      name: "contactInfo.emails", type: "objectArray", label: "Email Addresses",
      subFields: [
        { name: "label", type: "text", label: "Label", placeholder: "e.g. General Inquiries" },
        { name: "value", type: "text", label: "Email", placeholder: "info@company.com" },
      ],
    },
    {
      name: "contactInfo.phones", type: "objectArray", label: "Phone Numbers",
      subFields: [
        { name: "icon", type: "select", label: "Icon", options: [{ value: "phone", label: "Phone" }, { value: "mobile", label: "Mobile" }] },
        { name: "value", type: "text", label: "Number", placeholder: "+961 4 545 466" },
      ],
    },
    {
      name: "branchesData", type: "objectArray", label: "Branch City Tabs",
      subFields: [
        { name: "id", type: "number", label: "ID", placeholder: "1" },
        { name: "city", type: "text", label: "City", placeholder: "LEBANON" },
        { name: "cityImage", type: "image", label: "City Image" },
      ],
    },
  ],

  "solution-section": [
    { name: "id", type: "number", label: "Solution ID", required: true, placeholder: "1" },
    { name: "theme", type: "select", label: "Theme", options: [{ value: "light", label: "Light" }, { value: "dark", label: "Dark" }] },
    { name: "title", type: "text", label: "Title", required: true, placeholder: "LOYALTY PROGRAM SOLUTIONS" },
    { name: "description", type: "textarea", label: "Description", required: true },
    { name: "inquiryLabel", type: "text", label: "Inquiry Label", placeholder: "For more inquiry fill the below" },
    { name: "images", type: "imageArray", label: "Images", placeholder: "Add images" },
    { name: "tags", type: "array", label: "Tags", itemType: "text", placeholder: "Add a tag" },
    { name: "buttonText", type: "text", label: "Button Text", placeholder: "Request Demo" },
    { name: "buttonLink", type: "text", label: "Button Link", placeholder: "/contact" },
  ],

  "work-category-menu": [
    {
      name: "_workEditor", type: "workCategoryEditor", label: "Work Category Configuration",
      description: "Manage tabs, sub-categories, projects, and recent projects display settings.",
    },
  ],

  "sticky-services": [
    {
      name: "_stickyServicesEditor", type: "stickyServicesEditor", label: "Services Configuration",
      description: "Add, edit, reorder services with their titles, images, descriptions, and bullet-point items.",
    },
  ],
};

// ══════════════════════════════════════════════════════════════
// ── CARD TYPE EXTRA SECTION-LEVEL FIELDS ──
// When a "standard" section has a specific cardType, these extra
// section-level fields are appended to the base "standard" schema
// ══════════════════════════════════════════════════════════════
export const cardTypeExtraFields = {
  "stat-card": [],
  "std-card": [],
  "team-card": [
    { name: "lastCardTitle", type: "text", label: "Last Card Title (optional)", placeholder: "JOIN" },
    { name: "lastCardSubtitle", type: "text", label: "Last Card Subtitle (optional)", placeholder: "US" },
  ],
  "unique-card": [],
  "max5liner-card": [],
  "small-logo-card": [],
  "mid-logo-card": [],
  "large-logo-card": [],
};

// ══════════════════════════════════════════════════════════════
// ── FIXED CARD TYPES ──
// Sections with implicit (built-in) card types — no cardType selector
// ══════════════════════════════════════════════════════════════
export const FIXED_CARD_TYPES = {
  "gallery": "gallery-card",
  "slide-gallery": "slide-gallery-card",
  "cta": "cta-card",
};

// ══════════════════════════════════════════════════════════════
// ── HELPER: Resolve section fields ──
// Combines base section schema + any cardType extra fields
// ══════════════════════════════════════════════════════════════
export const getSectionFields = (sectionType, cardType) => {
  const base = sectionSchemas[sectionType] || [];
  if (sectionType === "standard" && cardType && cardTypeExtraFields[cardType]) {
    return [...base, ...cardTypeExtraFields[cardType]];
  }
  return base;
};

// ══════════════════════════════════════════════════════════════
// ── HELPER: Resolve card type ──
// Returns the effective card type for any section
// ══════════════════════════════════════════════════════════════
export const resolveCardType = (section) => {
  // Fixed sections (gallery, slide-gallery, cta) have implicit card types
  const fixedType = FIXED_CARD_TYPES[section.type];
  if (fixedType) return fixedType;
  // Standard sections store it in data.cardType
  return section.data?.cardType || null;
};

// Card types that can be associated with "standard" sections (for dropdown)
export const cardTypeOptions = [
  { value: "", label: "No Cards (Data in Section)" },
  { value: "stat-card", label: "Stat Cards" },
  { value: "std-card", label: "Standard Cards" },
  { value: "team-card", label: "Team Cards" },
  { value: "unique-card", label: "Unique Cards" },
  { value: "max5liner-card", label: "Max 5 Liner Cards" },
  { value: "small-logo-card", label: "Small Logo Cards" },
  { value: "mid-logo-card", label: "Mid Logo Cards" },
  { value: "large-logo-card", label: "Large Logo Cards" },
];

// Allowed section types (for dropdown) — with info
export const allowedSectionTypes = Object.keys(sectionTypeInfo).map((key) => ({
  value: key,
  label: sectionTypeInfo[key].label,
  description: sectionTypeInfo[key].description,
  icon: sectionTypeInfo[key].icon,
}));
