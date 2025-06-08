import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GalleryPage from './pages/GalleryPage';
import TextPage from './pages/TextPage';
import StatisticsPage from './pages/StatisticsPage';
import Header from './components/Header';
import StatisticsGridPage from './pages/StatisticsGridPage';


function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/text/:id" element={<TextPage />} />
        <Route path="/statistics" element={<StatisticsPage />} />
        <Route path="/statistics-grid" element={<StatisticsGridPage />} />
      </Routes>
    </Router>
  );
}

export default App;
