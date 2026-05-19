export const sectionSchemas = {
  "hero-section": [
    { name: "headingLine1", type: "text", label: "Heading Line 1" },
    { name: "headingLine2", type: "text", label: "Heading Line 2" },
    { name: "subheading", type: "text", label: "Subheading" },
    { name: "videoUrl", type: "text", label: "Video URL" },
  ],
  "tagline": [
    { name: "text", type: "textarea", label: "Tagline Text" },
  ],
  "cta": [
    { name: "title", type: "text", label: "CTA Title" },
    { name: "buttonText", type: "text", label: "Button Text" },
    { name: "buttonLink", type: "text", label: "Button Link" },
  ],
  "contact-hero": [
    { name: "title", type: "text", label: "Title" },
    { name: "email", type: "text", label: "Email Address" },
    { name: "phone", type: "text", label: "Phone Number" },
  ],
  "slide-gallery": [
    { name: "title", type: "text", label: "Gallery Title" }
  ],
  "gallery": [
    { name: "title", type: "text", label: "Gallery Title" }
  ],
  "project-section": [
    { name: "title", type: "text", label: "Section Title" },
  ],
  "sticky-services": [
    { name: "title", type: "text", label: "Section Title" },
  ],
  "solution-section": [
    { name: "title", type: "text", label: "Section Title" },
  ],
  "branch-section": [
    { name: "title", type: "text", label: "Section Title" },
  ],
  "empty": [
    { name: "height", type: "text", label: "Height (e.g. 100px)" }
  ],
  // Types that map to cards don't need section-level data usually, but they might have a title.
  "stat-card": [{ name: "title", type: "text", label: "Section Title" }, { name: "cardType", type: "hidden", value: "stat-card" }],
  "std-card": [{ name: "title", type: "text", label: "Section Title" }, { name: "cardType", type: "hidden", value: "std-card" }],
  "team-card": [{ name: "title", type: "text", label: "Section Title" }, { name: "cardType", type: "hidden", value: "team-card" }],
  "small-logo-card": [{ name: "title", type: "text", label: "Section Title" }, { name: "cardType", type: "hidden", value: "small-logo-card" }],
  "mid-logo-card": [{ name: "title", type: "text", label: "Section Title" }, { name: "cardType", type: "hidden", value: "mid-logo-card" }],
  "large-logo-card": [{ name: "title", type: "text", label: "Section Title" }, { name: "cardType", type: "hidden", value: "large-logo-card" }],
  "max5liner-card": [{ name: "title", type: "text", label: "Section Title" }, { name: "cardType", type: "hidden", value: "max5liner-card" }],
  "unique-card": [{ name: "title", type: "text", label: "Section Title" }, { name: "cardType", type: "hidden", value: "unique-card" }],
};

export const sectionTypes = Object.keys(sectionSchemas).map(type => ({
  value: type,
  label: type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}));
