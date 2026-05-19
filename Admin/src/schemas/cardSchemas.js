// ═══════════════════════════════════════════════════════════════
// CARD SCHEMAS — defines form fields for each card inside a section
// ═══════════════════════════════════════════════════════════════

export const cardSchemas = {
  // Standard section card types (admin selectable)
  'stat-card': [
    { name: 'title',  type: 'text',     label: 'Title' },
    { name: 'number', type: 'number',   label: 'Number' },
    { name: 'lines',  type: 'textarea', label: 'Lines (one per line)' },
  ],

  'std-card': [
    { name: 'title',       type: 'text',     label: 'Title' },
    { name: 'description', type: 'textarea', label: 'Description' },
  ],

  'team-card': [
    { name: 'name',  type: 'text',  label: 'Name' },
    { name: 'role',  type: 'text',  label: 'Role' },
    { name: 'image', type: 'image', label: 'Image URL' },
  ],

  'small-logo-card': [
    { name: 'name',  type: 'text',  label: 'Name' },
    { name: 'image', type: 'image', label: 'Image URL' },
  ],

  'mid-logo-card': [
    { name: 'image', type: 'image', label: 'Image URL' },
    { name: 'link',  type: 'text',  label: 'Link' },
  ],

  'large-logo-card': [
    { name: 'image', type: 'image', label: 'Image URL' },
    { name: 'link',  type: 'text',  label: 'Link' },
  ],

  'unique-card': [
    { name: 'title', type: 'text', label: 'Title' },
    { name: 'icon',  type: 'text', label: 'Icon URL (.svg)' },
  ],

  // Fixed card schemas for non-standard section types
  'gallery-card': [
    { name: 'image', type: 'image', label: 'Image URL' },
  ],

  'slide-gallery-card': [
    { name: 'image', type: 'image', label: 'Image URL' },
    { name: 'alt',   type: 'text',  label: 'Alt Text' },
  ],

  'cta-card': [
    { name: 'text', type: 'text', label: 'Text' },
    { name: 'link', type: 'text', label: 'Link' },
  ],
};
