import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import IntroPage from "./pages/IntroPage";
import GalleryPage from "./pages/GalleryPage";
import StatisticsPage from "./pages/StatisticsPage";
import Header from "./components/Header";
import IdleDetector from "./components/IdleDetector";
import ScrollToTop from "./components/ScrollToTop";
import { AnimatePresence } from "framer-motion";

function App() {
  const location = useLocation();
  const showHeader = location.pathname !== '/';
  

  return (
    <>
      <IdleDetector />
      <ScrollToTop />
      {showHeader && <Header />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/intro" element={<IntroPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="/PAGMAR2025" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
