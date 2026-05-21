import React, { useEffect, useMemo, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useParams } from "react-router-dom";

import { getPageBySlug } from "../redux/slices/pageSlice";

import { componentMap } from "../utils/ComponentMap";

function DynamicPage() {
  const dispatch = useDispatch();

  const { slug } = useParams();

  const { page, loading, error } = useSelector((state) => state.page);
  const [activeCityIndex, setActiveCityIndex] = useState(0);
  const [branchThemes, setBranchThemes] = useState({});

  const contactHeroSection = useMemo(
    () => page?.sections?.find((section) => section.type === "contact-hero"),
    [page],
  );

  const contactBranches =
    contactHeroSection?.data?.branchesData ||
    contactHeroSection?.data?.contactInfo?.branchesData ||
    [];

  // FETCH PAGE
  useEffect(() => {
    if (slug) {
      dispatch(getPageBySlug(slug));
    }
  }, [dispatch, slug]);

  // AUTO ACTIVE BRANCH FOR CONTACT HERO
  useEffect(() => {
    if (!contactBranches.length) return;

    const interval = setInterval(() => {
      setActiveCityIndex((prev) => (prev + 1) % contactBranches.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [contactBranches.length]);

  // DETECT THEME FOR CONTACT HERO BACKGROUNDS
  useEffect(() => {
    let active = true;

    const loadThemes = async () => {
      const { getImageTheme } = await import("../hooks/useMediaTheme");
      const themes = {};

      for (const branch of contactBranches) {
        if (!branch?.cityImage) continue;

        const detectedTheme = await getImageTheme(branch.cityImage);
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
  }, [contactBranches]);

  // (navbar theme is now self-detected via Nav.jsx area sampling)

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // ERROR
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  // NO PAGE
  if (!page) {
    return null;
  }

  const bgImage = page?.page?.bgImage;
  const pageWrapperStyle = bgImage
    ? {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }
    : {};

  return (
    <div style={pageWrapperStyle}>
      {page.sections?.map((section) => {
        const Component = section.data?.cardType
          ? componentMap[section.data.cardType]
          : componentMap[section.type];

        if (!Component) {
          console.warn(
            `No component found for ${section.data?.cardType || section.type}`,
          );

          return null;
        }

        return (
          <Component
            key={section._id}
            section={section}
            activeCityIndex={
              section.type === "contact-hero" ? activeCityIndex : undefined
            }
            branchTheme={
              section.type === "contact-hero"
                ? branchThemes[contactBranches[activeCityIndex]?.id] || "dark"
                : undefined
            }
          />
        );
      })}
    </div>
  );
}

export default DynamicPage;
