import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import SplashScreen from "../components/SplashScreen";
import Btn_slide from "../components/Btn_slide";
import { Outlet, useLocation } from "react-router-dom";
import { pageThemes } from "../styles/themes";

const App = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isContact = location.pathname === "/contact";
  const isNavOverlay = isHome || isContact;
  const [showSplash, setShowSplash] = useState(false);
  const [splashKey, setSplashKey] = useState(0);
  const [hideNav, setHideNav] = useState(false);

  const theme = pageThemes[location.pathname] || pageThemes["/"];

  const replaySplash = () => {
    setShowSplash(true);
    setSplashKey(prev => prev + 1);
  };

  useEffect(() => {
    if(isHome && performance.getEntriesByType("navigation")[0]?.type === "reload") { 
      setShowSplash(true);
    }
    // setShowSplash(false);
  }, [isHome]);

  return (
    <div className={`relative min-h-screen flex flex-col ${theme.bg}`}>
      {showSplash && <SplashScreen key={splashKey}/>}
      <Nav replaySplash={replaySplash} isOverlay={isHome} theme={theme} />
      <main className="flex-1">
        <Outlet context={theme}></Outlet>
      </main>
      {!isHome && <Footer />}
    </div>
  );
};

export default App;
