import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import logo from "../assets/logo/tedmob_logo_dark.svg";
import whiteLogo from "../assets/logo/tedmob_logo_white.svg";

const getRgbBrightness = (red, green, blue) =>
  (red * 299 + green * 587 + blue * 114) / 1000;

const parseRgbColor = (value) => {
  const match = value?.match(
    /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)/,
  );

  if (!match) return null;

  return {
    red: Number(match[1]),
    green: Number(match[2]),
    blue: Number(match[3]),
    alpha: match[4] ? Number(match[4]) : 1,
  };
};

const getThemeFromColor = (value) => {
  const parsed = parseRgbColor(value);

  if (!parsed || parsed.alpha < 0.75) return null;

  return getRgbBrightness(parsed.red, parsed.green, parsed.blue) >= 145
    ? "light"
    : "dark";
};

const sampleImageTheme = (imageElement) => {
  if (!imageElement.complete || !imageElement.naturalWidth) return null;

  try {
    const canvas = document.createElement("canvas");
    const sampleWidth = 48;
    const sampleHeight = 18;
    const sourceHeight = Math.max(
      1,
      Math.round(imageElement.naturalHeight * 0.18),
    );

    canvas.width = sampleWidth;
    canvas.height = sampleHeight;

    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return null;

    context.drawImage(
      imageElement,
      0,
      0,
      imageElement.naturalWidth,
      sourceHeight,
      0,
      0,
      sampleWidth,
      sampleHeight,
    );

    const data = context.getImageData(0, 0, sampleWidth, sampleHeight).data;
    let total = 0;
    let count = 0;

    for (let index = 0; index < data.length; index += 16) {
      total += getRgbBrightness(data[index], data[index + 1], data[index + 2]);
      count += 1;
    }

    return count ? (total / count >= 145 ? "light" : "dark") : null;
  } catch (error) {
    return null;
  }
};

const sampleVideoTheme = (videoElement) => {
  if (videoElement.readyState < 2 || !videoElement.videoWidth) return null;

  try {
    const canvas = document.createElement("canvas");
    const sampleWidth = 48;
    const sampleHeight = 18;

    canvas.width = sampleWidth;
    canvas.height = sampleHeight;

    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return null;

    context.drawImage(
      videoElement,
      0,
      0,
      videoElement.videoWidth,
      Math.max(1, Math.round(videoElement.videoHeight * 0.18)),
      0,
      0,
      sampleWidth,
      sampleHeight,
    );

    const data = context.getImageData(0, 0, sampleWidth, sampleHeight).data;
    let total = 0;
    let count = 0;

    for (let index = 0; index < data.length; index += 16) {
      total += getRgbBrightness(data[index], data[index + 1], data[index + 2]);
      count += 1;
    }

    return count ? (total / count >= 145 ? "light" : "dark") : null;
  } catch (error) {
    return null;
  }
};

const getThemeFromElement = (element) => {
  if (!element || element === document.documentElement) return null;

  if (element.tagName === "IMG") {
    const sampled = sampleImageTheme(element);
    if (sampled) return sampled;
  }

  if (element.tagName === "VIDEO") {
    const sampled = sampleVideoTheme(element);
    if (sampled) return sampled;
  }

  let current = element;

  while (current && current !== document.documentElement) {
    const dataTheme = current.getAttribute("data-theme");
    if (dataTheme === "dark" || dataTheme === "light") {
      return dataTheme;
    }

    const style = window.getComputedStyle(current);
    const colorTheme = getThemeFromColor(style.backgroundColor);

    if (colorTheme) {
      return colorTheme;
    }

    current = current.parentElement;
  }

  return null;
};

const samplePointTheme = (x, y, navElement) => {
  const stack = document.elementsFromPoint(x, y);

  for (const element of stack) {
    if (navElement && navElement.contains(element)) {
      continue;
    }

    const detectedTheme = getThemeFromElement(element);

    if (detectedTheme) {
      return detectedTheme;
    }
  }

  return null;
};

const getNavbarPositionClass = (navbarFixed, navbarTransparent) => {
  if (navbarFixed && navbarTransparent) {
    return "fixed transparent inset-x-0 top-0 z-30";
  }
  if (navbarFixed) {
    return "fixed inset-x-0 top-0 z-30";
  }
  if (navbarTransparent) {
    return "absolute transparent inset-x-0 top-0 z-30";
  }
  return "relative";
};

function Nav({ replaySplash }) {
  const { navItems } = useSelector((state) => state.navigation);
  const { page } = useSelector((state) => state.page);
  const location = useLocation();
  const navRef = useRef(null);
  const [navbarTheme, setNavbarTheme] = useState("light");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Derive navbar positioning from page config
  const navbarFixed = page?.page?.navbarFixed ?? false;
  const navbarTransparent = page?.page?.navbarTransparent ?? false;
  const positionClass = getNavbarPositionClass(navbarFixed, navbarTransparent);

  // Toggle mobile menu
  const handleToggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    // Prevent body scroll when menu is open
    document.body.style.overflow = !isMenuOpen ? "hidden" : "";
  };

  // Close menu on navigation
  const handleNavClick = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = "";
  };

  // Close menu on route change
  useEffect(() => {
    handleNavClick();
  }, [location.pathname]);

  // Cleanup body overflow on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return undefined;
    }

    let rafId = 0;
    let intervalId = 0;

    const readTheme = () => {
      const navElement = navRef.current;
      const navRect = navElement?.getBoundingClientRect();

      if (!navRect) {
        return "light";
      }

      const sampleXs = [0.12, 0.32, 0.5, 0.68, 0.88].map((fraction) =>
        Math.min(
          window.innerWidth - 1,
          Math.max(1, Math.round(navRect.left + navRect.width * fraction)),
        ),
      );

      const sampleYs = [0.35, 0.55, 0.75].map((fraction) =>
        Math.min(
          window.innerHeight - 1,
          Math.max(1, Math.round(navRect.top + navRect.height * fraction)),
        ),
      );

      let lightCount = 0;
      let darkCount = 0;

      for (const y of sampleYs) {
        for (const x of sampleXs) {
          const detectedTheme = samplePointTheme(x, y, navElement);

          if (detectedTheme === "light") {
            lightCount += 1;
          } else if (detectedTheme === "dark") {
            darkCount += 1;
          }
        }
      }

      if (lightCount === 0 && darkCount === 0) {
        return "light";
      }

      return darkCount > lightCount ? "dark" : "light";
    };

    const updateTheme = () => {
      if (rafId) return;

      rafId = window.requestAnimationFrame(() => {
        rafId = 0;

        const nextTheme = readTheme();

        setNavbarTheme((prevTheme) =>
          prevTheme === nextTheme ? prevTheme : nextTheme,
        );
      });
    };

    const observer = new MutationObserver(() => {
      updateTheme();
    });

    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["src", "srcset", "style", "class"],
    });

    window.addEventListener("scroll", updateTheme, { passive: true });
    window.addEventListener("resize", updateTheme);
    window.addEventListener("load", updateTheme);
    intervalId = window.setInterval(updateTheme, 250);

    updateTheme();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateTheme);
      window.removeEventListener("resize", updateTheme);
      window.removeEventListener("load", updateTheme);
      if (intervalId) {
        window.clearInterval(intervalId);
      }

      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [location.pathname]);

  // Determine if toggle button should be light or dark based on navbar theme
  const toggleButtonColor = navbarTheme === "dark" ? "white" : "black";
  const mobilePanelBg = navbarTheme === "dark" ? "bg-gray-900" : "bg-white";
  const mobileTextColor = navbarTheme === "dark" ? "text-white" : "text-gray-900";
  const mobileHoverColor = navbarTheme === "dark" ? "hover:text-gray-300" : "hover:text-black";
  const closeButtonColor = navbarTheme === "dark" ? "bg-white" : "bg-black";

  return (
    <div
      ref={navRef}
      data-navbar-theme={navbarTheme}
      className={`${positionClass} navbar-theme`}
    >
      <div className="flex justify-between items-center px-8 py-11">
        {/* LOGO */}
        <div>
          <Link
            to="/"
            className="nav-logo"
            onClick={() => {
              handleNavClick();
              replaySplash();
            }}
          >
            <img
              src={logo}
              alt="Company Logo"
              className="
                nav-logo-img
                logo-dark

                h-4
                lg:h-5

                w-auto
                object-contain
              "
            />

            <img
              src={whiteLogo}
              alt="Company Logo"
              aria-hidden="true"
              className="
                nav-logo-img
                logo-light

                h-4
                lg:h-5

                w-auto
                object-contain
              "
            />
          </Link>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          className={`
            nav-menu-icon
            nav-toggle

            md:hidden

            relative
            w-8
            h-8

            flex
            flex-col
            justify-center
            items-center

            z-50
          `}
          onClick={handleToggleMenu}
          aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={isMenuOpen}
          aria-controls="primary-nav"
          style={{ color: toggleButtonColor }}
        >
          <span 
            className={`
              nav-toggle-line
              block
              w-6
              h-0.5
              transition-all
              duration-300
              ${isMenuOpen ? "rotate-45 translate-y-1.5" : ""}
            `}
            style={{ backgroundColor: toggleButtonColor }}
          />
          <span 
            className={`
              nav-toggle-line
              block
              w-6
              h-0.5
              mt-1.5
              transition-all
              duration-300
              ${isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}
            `}
            style={{ backgroundColor: toggleButtonColor }}
          />
        </button>

        {/* DESKTOP / TABLET NAV */}
        <ul
          className="
            hidden
            md:flex

            items-center

            gap-5
            lg:gap-12

            shrink-0
            list-none
          "
          id="primary-nav"
        >
          {navItems.map((item) => {
            const route =
              item.slug === "home"
                ? "/"
                : `/${item.slug}`;

            return (
              <li key={item._id}>
                <Link
                  to={route}
                  className="
                    no-underline

                    font-semibold

                    text-[0.82rem]
                    lg:text-[0.95rem]

                    whitespace-nowrap
                    
                    transition-colors
                    duration-300
                    
                    hover:opacity-70
                  "
                  onClick={handleNavClick}
                >
                  {item.navTitle}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* MOBILE PANEL */}
        <div
          className={`
            nav-mobile-panel
            md:hidden

            fixed
            inset-0
            top-0
            
            ${mobilePanelBg}
            
            z-40
            
            transition-transform
            duration-500
            ease-[cubic-bezier(0.22,1,0.36,1)]
            
            ${isMenuOpen ? "translate-y-0" : "-translate-y-full"}
          `}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          {/* Mobile Menu Header */}
          <div className="flex justify-between items-center px-8 py-11">
            <div>
              <Link
                to="/"
                className="nav-logo"
                onClick={handleNavClick}
              >
                {navbarTheme === "dark" ? (
                  <img
                    src={whiteLogo}
                    alt="Company Logo"
                    className="
                      h-4
                      w-auto
                      object-contain
                    "
                  />
                ) : (
                  <img
                    src={logo}
                    alt="Company Logo"
                    className="
                      h-4
                      w-auto
                      object-contain
                    "
                  />
                )}
              </Link>
            </div>
            
            {/* Close Button */}
            <button
              type="button"
              className="
                w-8
                h-8
                flex
                flex-col
                justify-center
                items-center
                relative
              "
              onClick={handleToggleMenu}
              aria-label="Close navigation"
            >
              <span 
                className="block w-6 h-0.5 rotate-45 translate-y-1.5"
                style={{ backgroundColor: closeButtonColor }}
              />
              <span 
                className="block w-6 h-0.5 -rotate-45 -translate-y-1.5 mt-1.5"
                style={{ backgroundColor: closeButtonColor }}
              />
            </button>
          </div>

          {/* Mobile Menu Links */}
          <ul
            className="
              flex
              flex-col

              gap-6

              px-8
              pb-8
              pt-6

              list-none
            "
          >
            {navItems.map((item) => {
              const route =
                item.slug === "home"
                  ? "/"
                  : `/${item.slug}`;

              return (
                <li key={item._id}>
                  <Link
                    to={route}
                    className={`
                      nav-mobile-link
                      
                      block
                      
                      text-2xl
                      font-medium
                      
                      ${mobileTextColor}
                      ${mobileHoverColor}
                      
                      transition-colors
                      duration-300
                      
                      no-underline
                    `}
                    onClick={handleNavClick}
                  >
                    {item.navTitle}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Nav;