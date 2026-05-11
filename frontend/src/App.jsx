import React from "react";
import Footer from "./components/Footer";
import Nav from "./components/Nav";
import Btn_slide from "./components/Btn_slide";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1">{/* <Btn_slide inside="Submit" /> */}</main>
      <Footer />
    </div>
  );
};

export default App;
