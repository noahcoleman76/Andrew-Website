import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Stories from "./pages/Stories";
import Gallery from "./pages/Gallery";
import MemorialVideo from "./pages/MemorialVideo";
import Message from "./pages/Message";
import Family from "./pages/Family";
import Footer from "./components/Footer";

const App: React.FC = () => {
  return (
    <>
      {/* Overlay */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.6)",
          zIndex: -1, // Place behind all content
        }}
      />
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Stories />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/memorial-video" element={<MemorialVideo />} />
          <Route path="/message" element={<Message />} />
          <Route path="/family" element={<Family />} />
        </Routes>
      </div>
      <Footer/>
    </>
  );
};

export default App;
