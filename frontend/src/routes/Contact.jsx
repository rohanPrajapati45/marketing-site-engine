/* eslint-disable no-unused-vars */
import {
  useMemo,
  useState,
  useEffect,
  useRef,
} from 'react';

import {
  useDispatch,
  useSelector,
} from 'react-redux';

import {
  getPageBySlug,
} from '../redux/slices/pageSlice';

import {
  componentMap,
} from '../utils/ComponentMap';

import '../styles/contactInfo.css';
import '../styles/branch.css';
import '../styles/contactForm.css';
import '../styles/contactSubmission.css';

function Contact() {

  const dispatch = useDispatch();

  const {
    page,
    loading,
    error,
  } = useSelector(
    (state) => state.page
  );

  const [activeCityIndex, setActiveCityIndex] =
    useState(0);

  const [branchThemes, setBranchThemes] =
    useState({});

  const formRef = useRef(null);

  const headingRef = useRef(null);

  // FETCH CONTACT PAGE
  useEffect(() => {

    dispatch(
      getPageBySlug('contact')
    );

  }, [dispatch]);

  // BRANCH SECTIONS
  const branchSections =
    page?.sections?.filter(
      (section) =>
        section.type ===
        'branch-section'
    ) || [];

  // AUTO ACTIVE BRANCH
  useEffect(() => {

    if (!branchSections.length)
      return;

    const interval = setInterval(() => {

      setActiveCityIndex(
        (prev) =>
          (prev + 1) %
          branchSections.length
      );

    }, 3000);

    return () =>
      clearInterval(interval);

  }, [branchSections.length]);

  const contactHeroSection = useMemo(
    () =>
      page?.sections?.find(
        (section) =>
          section.type === 'contact-hero'
      ),
    [page]
  );

  useEffect(() => {
    let active = true;

    const loadThemes = async () => {
      const { getImageTheme } = await import(
        '../hooks/useMediaTheme'
      );
      const themes = {};

      const branches =
        contactHeroSection?.data
          ?.branchesData || [];

      for (const branch of branches) {
        if (!branch?.cityImage) continue;

        const detectedTheme =
          await getImageTheme(
            branch.cityImage
          );
        themes[branch.id] = detectedTheme;
      }

      if (active) {
        setBranchThemes(themes);
      }
    };

    loadThemes();

    return () => {
      active = false;
    };
  }, [contactHeroSection]);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const branches =
      contactHeroSection?.data
        ?.branchesData || [];

    const activeBranch =
      branches[activeCityIndex];
    if (!activeBranch) {
      document.documentElement.dataset.homeTheme =
        'light';
      return;
    }

    const theme =
      branchThemes[activeBranch.id] ||
      'dark';

    document.documentElement.dataset.homeTheme =
      theme;
  }, [
    activeCityIndex,
    branchThemes,
    contactHeroSection,
  ]);

  // REVEAL ANIMATION
  useEffect(() => {

    const revealEls =
      document.querySelectorAll(
        '.contact-page .reveal'
      );

    if (!revealEls.length)
      return;

    const observer =
      new IntersectionObserver(
        (entries) => {

          entries.forEach(
            (entry) => {

              if (
                entry.isIntersecting
              ) {

                entry.target.classList.add(
                  'in-view'
                );

                observer.unobserve(
                  entry.target
                );

              }

            }
          );

        },
        {
          threshold: 0.1,
        }
      );

    revealEls.forEach((el) =>
      observer.observe(el)
    );

    return () =>
      observer.disconnect();

  }, []);

  const handleSubmit = (e) => {

    e.preventDefault();

    alert(
      'Form submitted! Connect your backend here.'
    );

  };

  // LOADING
  if (loading) {

    return (
      <div className="contact-page">
        <div className="solutions-loading">
          <div className="solutions-loading-spinner" />
        </div>
      </div>
    );
  }

  // ERROR
  if (error) {

    return (
      <div className="contact-page">
        <div className="solutions-error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // NO PAGE
  if (!page) {
    return null;
  }

  return (

    <div className="contact-page">

      {page.sections?.map(
        (section, index) => {
           if (
    section.type === 'branch-section' &&
    index !==
      page.sections.findIndex(
        (s) =>
          s.type === 'branch-section'
      )
  ) {
    return null;
  }
          const Component =
            componentMap[
              section.type
            ];

          if (!Component) {

            console.warn(
              `No component found for ${section.type}`
            );

            return null;
          }

          return (
            <Component
              key={section._id}
              section={section}
              activeCityIndex={
                activeCityIndex
              }
              branchSections={
                branchSections
              }
              formRef={formRef}
              headingRef={
                headingRef
              }
              handleSubmit={
                handleSubmit
              }
            />
          );

        }
      )}

    </div>
  );
}

export default Contact;