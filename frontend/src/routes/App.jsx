import React, { useState } from "react";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import SplashScreen from "../components/SplashScreen";
import Btn_slide from "../components/Btn_slide";
import { Outlet, useLocation } from "react-router-dom";
import { pageThemes } from "../styles/themes";

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [hideNav, setHideNav] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  const theme = pageThemes[location.pathname] || pageThemes["/"];

  const replaySplash = () => {
    setShowSplash(false);
    setTimeout(() => {
      setShowSplash(true);
    }, 1);
  };

  return (
    <div className={`relative min-h-screen flex flex-col ${theme.bg}`}>
      {showSplash && <SplashScreen />}
      <Nav replaySplash={replaySplash} isOverlay={isHome} theme={theme} />
      <main className="flex-1">
        <Outlet context={theme}></Outlet>
      </main>
      {!isHome && <Footer />}
    </div>
  );
};

export default App;
