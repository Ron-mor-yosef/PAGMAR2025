import { useEffect, useState } from 'react';
import { loadCSV } from '../utils/parseCSV';
import TextCard from '../components/TextCard';
import './GalleryPage.css';

const GalleryPage = () => {
  const [texts, setTexts] = useState([]);
  const [view, setView] = useState('snippet');
  const [emotion, setEmotion] = useState('');

  useEffect(() => {
    loadCSV('/texts.csv').then(setTexts);
  }, []);

  const filtered = emotion
    ? texts.filter((t) => t['רגשות'] === emotion)
    : texts;

  return (
    <main>
      <div>
        <label>סינון לפי רגש:</label>
        <select value={emotion} onChange={(e) => setEmotion(e.target.value)}>
          <option value="">הכל</option>
          {[...new Set(texts.map(t => t['רגשות']))].map((e) => (
            <option key={e}>{e}</option>
          ))}
        </select>

        <label>תצוגה:</label>
        <select value={view} onChange={(e) => setView(e.target.value)}>
          <option value="snippet">מקטע</option>
          <option value="citation">ציטוט</option>
          <option value="title">כותרת</option>
        </select>
      </div>

      <div>
        {filtered.map((text, i) => (
          <TextCard key={i} text={text} index={i} view={view} />
        ))}
      </div>
    </main>
  );
};

export default GalleryPage;
