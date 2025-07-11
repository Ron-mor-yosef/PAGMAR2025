import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import IntroPage from "./pages/IntroPage";
import GalleryPage from "./pages/GalleryPage";
import StatisticsPage from "./pages/StatisticsPage";
import Header from "./components/Header";
import IdleDetector from "./components/IdleDetector";
import ScrollToTop from "./components/ScrollToTop";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";

function App() {
  const location = useLocation();
  const showHeader = location.pathname !== '/';
  // Idle state lives here
  const [idleTimeout, setIdleTimeout] = useState(120); // seconds
  const [idleEnabled, setIdleEnabled] = useState(true);

  return (
    <>
      <IdleDetector
        timeout={idleTimeout}
        enabled={idleEnabled}
      />
      <ScrollToTop />
      {showHeader && <Header />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage
            idleTimeout={idleTimeout}
            setIdleTimeout={setIdleTimeout}
            idleEnabled={idleEnabled}
            setIdleEnabled={setIdleEnabled}
          />} />
          <Route path="/intro" element={<IntroPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          {/* Redirect any unknown route to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
