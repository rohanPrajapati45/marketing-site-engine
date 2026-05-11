import React, { useState } from "react";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import SplashScreen from "../components/SplashScreen";
import Btn_slide from "../components/Btn_slide";
import { Outlet, useLocation } from "react-router-dom";

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const location = useLocation();
  const isHome = location.pathname === "/";

  const replaySplash = () => {
    setShowSplash(false);
    setTimeout(() => {
      setShowSplash(true);
    }, 1);
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      {showSplash && <SplashScreen />}
      <Nav replaySplash={replaySplash} isOverlay={isHome} />
      <main className="flex-1">
        <Outlet></Outlet>
      </main>
      <Footer />
    </div>
  );
};

export default App;
