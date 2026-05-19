export const cardSchemas = {
  "stat-card": [
    { name: "title", type: "text", label: "Title" },
    { name: "value", type: "text", label: "Value (e.g., 99%)" },
    { name: "description", type: "textarea", label: "Description" },
  ],
  "std-card": [
    { name: "title", type: "text", label: "Title" },
    { name: "description", type: "textarea", label: "Description" },
    { name: "image", type: "image", label: "Image URL" },
  ],
  "team-card": [
    { name: "name", type: "text", label: "Name" },
    { name: "role", type: "text", label: "Role" },
    { name: "image", type: "image", label: "Profile Image" },
    { name: "linkedin", type: "text", label: "LinkedIn URL" },
  ],
  "small-logo-card": [
    { name: "logo", type: "image", label: "Logo URL" },
    { name: "altText", type: "text", label: "Alt Text" },
  ],
  "mid-logo-card": [
    { name: "logo", type: "image", label: "Logo URL" },
    { name: "title", type: "text", label: "Title" },
  ],
  "large-logo-card": [
    { name: "logo", type: "image", label: "Logo URL" },
    { name: "description", type: "textarea", label: "Description" },
  ],
  "max5liner-card": [
    { name: "title", type: "text", label: "Title" },
    { name: "lines", type: "textarea", label: "Lines (newline separated)" },
  ],
  "unique-card": [
    { name: "title", type: "text", label: "Title" },
    { name: "subtitle", type: "text", label: "Subtitle" },
    { name: "image", type: "image", label: "Image URL" },
    { name: "link", type: "text", label: "Link" },
  ],
};
