import React, { useState } from "react";
import Footer from "./components/Footer";
import Nav from "./components/Nav";
import SplashScreen from "./components/SplashScreen";

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  const replaySplash = () => {
    setShowSplash(false);

    setTimeout(() => {
      setShowSplash(true);
    }, 50);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {showSplash && <SplashScreen />}

      <Nav replaySplash={replaySplash} />

      <main className="flex-1"></main>

      <Footer />
    </div>
  );
};

export default App;