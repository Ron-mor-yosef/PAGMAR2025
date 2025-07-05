import { Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import IntroPage from './pages/IntroPage';
import GalleryPage from './pages/GalleryPage';
import TextPage from './pages/TextPage';
import StatisticsPage from './pages/StatisticsPage';
import Header from './components/Header';
import IdleDetector from './components/IdleDetector';


function App() {
  const location = useLocation();

  // Only show header if not on homepage
  const showHeader = location.pathname !== '/';

  return (
    <>
      <IdleDetector />
      {showHeader && <Header />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/intro" element={<IntroPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/text/:id" element={<TextPage />} />
        <Route path="/statistics" element={<StatisticsPage />} />
      </Routes>
    </>
  );
}

export default App;
