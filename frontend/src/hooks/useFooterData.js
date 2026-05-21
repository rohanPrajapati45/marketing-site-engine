import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

/**
 * useFooterData — fetches footer settings from the API and combines with
 * existing navigation data from Redux store.
 */
const useFooterData = () => {
  const [footerSettings, setFooterSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Nav items are already in Redux (fetched globally)
  const { navItems } = useSelector((state) => state.navigation);

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${BASE_URL}/api/footer`);
        if (res.data.success) {
          setFooterSettings(res.data.data);
        }
      } catch (err) {
        console.error("Footer fetch error:", err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFooter();
  }, []);

  // Filter and sort social links
  const socialLinks = useMemo(() => {
    if (!footerSettings?.socialLinks) return [];
    return footerSettings.socialLinks
      .filter((link) => link.isActive)
      .sort((a, b) => a.order - b.order);
  }, [footerSettings]);

  // Nav links from Redux, sorted by navOrder
  const navLinks = useMemo(() => {
    if (!navItems || navItems.length === 0) return [];
    return [...navItems].sort((a, b) => (a.navOrder || 0) - (b.navOrder || 0));
  }, [navItems]);

  const copyrightText = footerSettings?.copyrightText || "";
  const showLogo = footerSettings?.showLogo !== false;

  return {
    socialLinks,
    navLinks,
    copyrightText,
    showLogo,
    isLoading,
    error,
  };
};

export default useFooterData;
