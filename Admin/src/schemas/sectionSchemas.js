// ═══════════════════════════════════════════════════════════════
// SECTION SCHEMAS — defines form fields for each section.type
// ═══════════════════════════════════════════════════════════════

// The ONLY valid section types (must match backend allowedSectionTypes)
export const SECTION_TYPES = [
  { value: 'tagline',    label: 'Tagline' },
  { value: 'empty',      label: 'Empty' },
  { value: 'standard',   label: 'Standard' },
  { value: 'gallery',    label: 'Gallery' },
  { value: 'slide-gallery', label: 'Slide Gallery' },
  { value: 'cta',        label: 'CTA' },
];

// Which section types support cards (and how)
// - 'standard' lets admin pick a cardType from CARD_TYPE_OPTIONS
// - gallery, slide-gallery, cta have fixed internal card schemas
export const SECTIONS_WITH_CARDS = {
  standard:        'selectable',   // admin picks cardType
  gallery:         'fixed',        // always uses gallery-card schema
  'slide-gallery': 'fixed',        // always uses slide-gallery-card schema
  cta:             'fixed',        // always uses cta-card schema
};

// Card types available when section.type === 'standard'
export const CARD_TYPE_OPTIONS = [
  { value: 'stat-card',        label: 'Stat Card' },
  { value: 'std-card',         label: 'Std Card' },
  { value: 'team-card',        label: 'Team Card' },
  { value: 'small-logo-card',  label: 'Small Logo Card' },
  { value: 'mid-logo-card',    label: 'Mid Logo Card' },
  { value: 'large-logo-card',  label: 'Large Logo Card' },
  { value: 'unique-card',      label: 'Unique Card' },
];

// Fixed card type mapping for non-standard sections that have cards
export const FIXED_CARD_TYPES = {
  gallery:         'gallery-card',
  'slide-gallery': 'slide-gallery-card',
  cta:             'cta-card',
};

// Section-level data fields (NOT card fields)
export const sectionFieldSchemas = {
  tagline: [
    { name: 'title',    type: 'text',     label: 'Title' },
    { name: 'subtitle', type: 'text',     label: 'Subtitle' },
  ],

  empty: [
    { name: 'height', type: 'text', label: 'Height (e.g. 100px)' },
  ],

  standard: [
    { name: 'title',    type: 'text', label: 'Section Title' },
    { name: 'subtitle', type: 'text', label: 'Subtitle (optional)' },
  ],

  gallery: [
    { name: 'title', type: 'text', label: 'Gallery Title' },
  ],

  'slide-gallery': [
    { name: 'title',       type: 'text',     label: 'Title' },
    { name: 'description', type: 'textarea', label: 'Description' },
    { name: 'buttonText',  type: 'text',     label: 'Button Text' },
    { name: 'buttonLink',  type: 'text',     label: 'Button Link' },
  ],

  cta: [
    { name: 'title',    type: 'text', label: 'Title' },
    { name: 'subtitle', type: 'text', label: 'Subtitle' },
  ],
};

// Extra section-level fields that only appear for specific cardTypes
// (these go in section.data, NOT inside individual cards)
export const cardTypeExtraFields = {
  'team-card': [
    { name: 'lastCardTitle',    type: 'text', label: 'Last Card Title' },
    { name: 'lastCardSubtitle', type: 'text', label: 'Last Card Subtitle' },
  ],
};
