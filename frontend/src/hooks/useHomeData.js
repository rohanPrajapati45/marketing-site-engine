// src/hooks/useHomeData.js
// Fetches hero + projects from backend
// Phase 1: hardcoded fallback
// Phase 2: real API (just uncomment)

import { useState, useEffect } from 'react';

// ── HARDCODED FALLBACK — same as your current projectsData ──
// Used when backend not connected yet
// const FALLBACK_PROJECTS = [
//   {
//     _id: '1',
//     order: 1,
//     titleBold: 'Fintech Solutions',
//     titleLines: ['E-Wallet & Omnichannel', 'Digital Banking'],
//     clientLogo: '/images/logos/logo1.png',
//     clientLogoAlt: 'OMT Pay',
//     clientName: 'OMT',
//     clientCountry: '',
//     mockupImage: '/images/page1.webp',
//     mockupAlt: 'OMT Pay App Mockup',
//     caseStudyUrl: '/work/omt',
//     active: true,
//   },
//   {
//     _id: '2',
//     order: 2,
//     titleBold: 'Telecom Solutions',
//     titleLines: ['Web & Mobile App Solutions', 'For Telecom Operators'],
//     clientLogo: '/images/logos/logo2.png',
//     clientLogoAlt: 'Zain',
//     clientName: 'ZAIN',
//     clientCountry: 'SAUDI ARABIA',
//     mockupImage: '/images/page2.webp',
//     mockupAlt: 'Zain App Mockup',
//     caseStudyUrl: '/work/zain',
//     active: true,
//   },
//   {
//     _id: '3',
//     order: 3,
//     titleBold: 'E-Commerce Solutions',
//     titleLines: ['Custom E-Commerce', 'Websites & Mobile Apps'],
//     clientLogo: '/images/logos/logo3.png',
//     clientLogoAlt: 'Z&V',
//     clientName: 'Z&V',
//     clientCountry: '',
//     mockupImage: '/images/page3.jpg',
//     mockupAlt: 'Z&V App Mockup',
//     caseStudyUrl: '/work/zv',
//     active: true,
//   },
//   {
//     _id: '4',
//     order: 4,
//     titleBold: 'Mobile Banking',
//     titleLines: ['Full-Featured Digital', 'Banking Platform'],
//     clientLogo: '/images/logos/logo4.png',
//     clientLogoAlt: 'Bokra',
//     clientName: 'BOKRA',
//     clientCountry: 'MENA REGION',
//     mockupImage: '/images/page4.jpg',
//     mockupAlt: 'Bokra App Mockup',
//     caseStudyUrl: '/work/bokra',
//     active: true,
//   },
//   {
//     _id: '5',
//     order: 5,
//     titleBold: 'Healthcare Technology',
//     titleLines: ['Smart Digital Health', 'Solutions & Platforms'],
//     clientLogo: '/images/logos/logo5.png',
//     clientLogoAlt: 'Client 5',
//     clientName: 'CLIENT 5',
//     clientCountry: '',
//     mockupImage: '/images/page5.jpg',
//     mockupAlt: 'Healthcare App Mockup',
//     caseStudyUrl: '/work/client5',
//     active: true,
//   },
//   {
//     _id: '6',
//     order: 6,
//     titleBold: 'Entertainment Platform',
//     titleLines: ['Music & Media Streaming', 'for the MENA Region'],
//     clientLogo: '/images/logos/logo6.png',
//     clientLogoAlt: 'Client 6',
//     clientName: 'CLIENT 6',
//     clientCountry: '',
//     mockupImage: '/images/page6.jpg',
//     mockupAlt: 'Entertainment App Mockup',
//     caseStudyUrl: '/work/client6',
//     active: true,
//   },
//   {
//     _id: '7',
//     order: 7,
//     titleBold: 'Brand & Digital',
//     titleLines: ['Creative Direction &', 'Digital Transformation'],
//     clientLogo: '/images/logos/logo7.png',
//     clientLogoAlt: 'Client 7',
//     clientName: 'CLIENT 7',
//     clientCountry: '',
//     mockupImage: '/images/page7.webp',
//     mockupAlt: 'Brand App Mockup',
//     caseStudyUrl: '/work/client7',
//     active: true,
//   },
// ];

export function useHomeData() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {

    // ════════════════════════════════════════
    // PHASE 1 — Hardcoded fallback
    // Comment this block when backend is ready
    // ════════════════════════════════════════
    setProjects(FALLBACK_PROJECTS);
    setLoading(false);

    // ════════════════════════════════════════
    // PHASE 2 — Real API
    // Uncomment this block when backend ready
    // Comment out PHASE 1 block above
    // ════════════════════════════════════════
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/home/projects');
        if (!res.ok) throw new Error('Failed to fetch projects');
        const data = await res.json();
        setProjects(data.data);      // data.data = array from your controller
      } catch (err) {
        setError(err.message);
        setProjects(FALLBACK_PROJECTS); // fallback on error
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();

  }, []);

  return { projects, loading, error };
}