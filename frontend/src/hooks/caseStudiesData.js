/*
═══════════════════════════════════════════════
HOW ADMIN MANAGES CASE STUDIES
═══════════════════════════════════════════════

SECTIONS ARE FULLY FLEXIBLE:
  - Add as many or as few sections as needed
  - Minimum: 1 section
  - Maximum: unlimited
  - Each section is independent

To ADD a section → add a new object to sections[]
To REMOVE a section → delete the object from sections[]
To REORDER sections → change order of objects in sections[]
To FLIP image side → change type: 'image-right' or 'image-left'

EACH SECTION OBJECT SHAPE:
{
  id: 1,                       ← unique number per section
  type: 'image-right',         ← 'image-right' or 'image-left'
  label: 'THE PROBLEM',        ← section heading (any text)
  points: [                    ← any number of bullet points
    'Point one text here',
    'Point two text here',
    ...add or remove as needed
  ],
  image: '/images/casestudy/slug/any-image-name.jpg',
}

EXAMPLES OF VALID SECTION COUNTS:

  Only 2 sections (problem + solution):
    sections: [
      { id:1, type:'image-right', label:'THE PROBLEM', ... },
      { id:2, type:'image-left',  label:'THE SOLUTION', ... },
    ]

  7 sections:
    sections: [
      { id:1, label:'OVERVIEW',  ... },
      { id:2, label:'CHALLENGE', ... },
      { id:3, label:'RESEARCH',  ... },
      { id:4, label:'DESIGN',    ... },
      { id:5, label:'BUILD',     ... },
      { id:6, label:'TESTING',   ... },
      { id:7, label:'RESULTS',   ... },
    ]

  Any label is valid — not limited to predefined names.
  Admin can use: 'THE APPROACH', 'OUR PROCESS', 'IMPACT',
  'TECHNOLOGY STACK', 'CLIENT FEEDBACK' — anything.

IMAGE NAMING:
  Images can be named anything — just update the path.
  public/images/casestudy/[slug]/[any-name].jpg

  Example:
    '/images/casestudy/omt/screen-1.jpg'
    '/images/casestudy/omt/wireframe.jpg'
    '/images/casestudy/omt/final-result.jpg'
═══════════════════════════════════════════════
*/

export const caseStudiesData = [
  {
    id: 'omt',
    slug: 'omt',
    clientName: 'OMT',
    projectTitle: 'OMT Pay — Fintech Solutions',
    category: 'Mobile Application',
    heroImage: '/images/casestudy/omt/page1.webp',
    accentColor: '#f5c800',
    overview: 'OMT Pay is Lebanon\'s leading digital wallet and omnichannel banking platform.',

    sections: [
      {
        id: 1,
        type: 'image-right',
        label: 'THE PROBLEM',
        points: [
          'The need for online identity verification',
          'Shopping cart abandonment',
          'The headaches of product return and refund',
          'The heightened demand of data security',
        ],
        image: '/images/casestudy/omt/problem.webp',
      },
      {
        id: 2,
        type: 'image-left',
        label: 'RESULTS',
        points: [
          'Fast Notification control to stop/start transactions',
          'Quick swap between wallet and card modes',
          'Over 2 million active users within first year',
          'Reduced transaction time by 65%',
        ],
        image: '/images/casestudy/omt/result.png',
      },
    ],
  },

  {
    id: 'zain',
    slug: 'zain',
    clientName: 'ZAIN',
    projectTitle: 'Zain — Telecom Solutions',
    category: 'Web & Mobile',
    heroImage: '/images/casestudy/zain/solution.png',
    accentColor: '#2d6a2d',
    overview: 'A full suite of web and mobile solutions for Zain telecom across Saudi Arabia.',

    sections: [
      {
        id: 1,
        type: 'image-right',
        label: 'THE PROBLEM',
        points: [
          'High volume of in-store visits for basic service requests',
          'Fragmented digital touchpoints across web and mobile',
          'Low digital adoption among existing subscribers',
        ],
        image: '/images/casestudy/zain/problem.jpg',
      },
      {
        id: 2,
        type: 'image-left',
        label: 'THE SOLUTION',
        points: [
          'Unified digital platform across iOS, Android and Web',
          'Self-service portal covering 90% of in-store requests',
          'Personalized content engine based on usage patterns',
          'Integrated live chat and AI support assistant',
        ],
        image: '/images/casestudy/zain/solution.jpg',
      },
      {
        id: 3,
        type: 'image-right',
        label: 'THE APPROACH',
        points: [
          'Deep stakeholder interviews across KSA and Kuwait',
          'Agile sprints with cross-functional teams',
          'API-first architecture for future scalability',
        ],
        image: '/images/casestudy/zain/approach.jpg',
      },
      {
        id: 4,
        type: 'image-left',
        label: 'RESULTS',
        points: [
          'Fast Notification control to stop/start radio stream',
          'Quick swap Navigation between Channel List',
          'Many of radio stations accessible from device',
          '35% reduction in in-store visit volume',
        ],
        image: '/images/casestudy/zain/result.png',
      },
    ],
  },
];

// ── HELPER — get case study by slug ─
export const getCaseStudyBySlug = (slug) => {
  return caseStudiesData.find((cs) => cs.slug === slug) || null;
};

/*
═══════════════════════════════════════
HOW ADMIN ADDS A NEW CASE STUDY:
  1. Add new object to caseStudiesData array
  2. Set a unique slug (matches URL: /work/slug)
  3. Add images to public/images/casestudy/[slug]/
  4. Fill in sections array with label + points + image
  5. Route auto-registers via useParams — no code change

HOW ADMIN EDITS EXISTING:
  - Change points[] to update bullet text
  - Change image path to update photo
  - Change type: 'image-right' or 'image-left' to flip layout
  - Add/remove objects in sections[] to add/remove sections
═══════════════════════════════════════
*/
