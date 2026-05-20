import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import SplashScreen from "../components/SplashScreen";
import Btn_slide from "../components/Btn_slide";
import { Outlet, useLocation } from "react-router-dom";
import { pageThemes } from "../styles/themes";
import { useDispatch } from "react-redux";
import { getNavigation } from "../redux/slices/navigationSlice";

const App = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isContact = location.pathname === "/contact";
  // const isNavOverlay = isHome || isContact;
  const [showSplash, setShowSplash] = useState(false);
  const [splashKey, setSplashKey] = useState(0);
  const [hideNav, setHideNav] = useState(false);

  const pathname = location.pathname;

  const [dynamicTheme, setDynamicTheme] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getNavigation());
  }, [dispatch]);

  useEffect(() => {
    if (pathname !== "/") {
      setDynamicTheme(null);

      if (typeof document !== "undefined" && !isContact) {
        document.documentElement.dataset.homeTheme = "light";
      }

      return;
    }

    const observer = new MutationObserver(() => {
      const current = document.documentElement.dataset.homeTheme;

      setDynamicTheme(current);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-home-theme"],
    });

    setDynamicTheme(document.documentElement.dataset.homeTheme);

    return () => observer.disconnect();
  }, [pathname, isContact]);

  const theme =
    pathname === "/"
      ? dynamicTheme === "light"
        ? {
            bg: "bg-white",
            navbar: "navbar-theme text-black",
          }
        : {
            bg: "bg-black",
            navbar: "navbar-theme text-white",
          }
      : pathname === "/contact"
        ? {
            bg: "bg-transparent",
            navbar: "navbar-theme bg-transparent",
          }
        : pathname.startsWith("/blog-details/")
          ? pageThemes["/blog-details/:id"]
          : pageThemes[pathname] || pageThemes["/"];

  const replaySplash = () => {
    setShowSplash(true);
    setSplashKey((prev) => prev + 1);
  };

  useEffect(() => {
    if (
      isHome &&
      performance.getEntriesByType("navigation")[0]?.type === "reload"
    ) {
      setShowSplash(true);
    }
    // setShowSplash(false);
  }, [isHome]);

  return (
    <div className={`relative min-h-screen flex flex-col ${theme.bg}`}>
      {showSplash && <SplashScreen key={splashKey} />}
      <Nav
        replaySplash={replaySplash}
        isHome={isHome}
        isContact={isContact}
        theme={theme}
      />
      <main className="flex-1">
        <Outlet context={theme}></Outlet>
      </main>
      {!isHome && <Footer />}
    </div>
  );
};

export default App;
