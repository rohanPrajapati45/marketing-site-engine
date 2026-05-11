import React from "react";
import Footer from "./components/Footer";
import Nav from "./components/Nav";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1"></main>
      <Footer />
    </div>
  );
};

export default App;
