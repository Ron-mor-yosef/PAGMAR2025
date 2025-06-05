import { useEffect, useRef, useState } from 'react';
import { loadCSV } from '../utils/parseCSV';
import TextCard from '../components/TextCard';
import './GalleryPage.css';

const GalleryPage = () => {
  const [texts, setTexts] = useState([]);
  const [view, setView] = useState('snippet');
  const [emotions, setEmotions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const galleryRef = useRef(null);
  const [scrollIndex, setScrollIndex] = useState(0);

  useEffect(() => {
    loadCSV('/texts.csv').then(data => {
      setTexts(data);

      // Extract unique emotions
      const allEmotions = [
        ...new Set(
          data.flatMap(t =>
            (t['רגשות'] || '')
              .split(/,|\n/)
              .map(e => e.trim())
              .filter(Boolean)
          )
        ),
      ];
      setEmotions(allEmotions);

      // Extract unique categories
      const allCategories = [
        ...new Set(
          data.flatMap(t =>
            (t['קטגוריות'] || '')
              .split(/,|\n/)
              .map(e => e.trim())
              .filter(Boolean)
          )
        ),
      ];
      setCategories(allCategories);
    });
  }, []);

  // Multi-selection toggle logic
  const toggleEmotion = (emotion) => {
    setSelectedEmotions((prev) =>
      prev.includes(emotion)
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Filtering logic for multi-selection
  const filtered = texts.filter((t) => {
    const textEmotions = (t['רגשות'] || '').split(/,|\n/g).map(e => e.trim()).filter(Boolean);
    const textCategories = (t['קטגוריות'] || '').split(/,|\n/g).map(e => e.trim()).filter(Boolean);

    const emotionMatch =
      selectedEmotions.length === 0 ||
      selectedEmotions.some(e => textEmotions.includes(e));

    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.some(c => textCategories.includes(c));

    return emotionMatch && categoryMatch;
  });

  const cardWidth = 320 + 24; // card width + gap (adjust if needed)
  const visibleCards = 3; // How many cards fit in the viewport (adjust as needed)
  const totalCards = filtered.length;

  const scrollToIndex = (idx) => {
    if (!galleryRef.current) return;
    const maxIndex = Math.max(0, totalCards - visibleCards);
    const newIndex = Math.max(0, Math.min(idx, maxIndex));
    galleryRef.current.scrollTo({
      left: newIndex * cardWidth,
      behavior: 'smooth'
    });
    setScrollIndex(newIndex);
  };

  const handlePrev = () => scrollToIndex(scrollIndex - 1);
  const handleNext = () => scrollToIndex(scrollIndex + 1);

  // Redirect vertical wheel to horizontal scroll
  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;

    const onWheel = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        gallery.scrollLeft += e.deltaY;
      }
    };

    gallery.addEventListener('wheel', onWheel, { passive: false });
    return () => gallery.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <main>
      <div className="gallery-filters">
        <div className="single-filter">
          <label>רגשות</label>
          <div className="filter-options">
            <button
              type="button"
              className={selectedEmotions.length === 0 ? 'active' : ''}
              onClick={() => setSelectedEmotions([])}
            >
              הכל
            </button>
            {emotions.map((e) => (
              <button
                key={e}
                type="button"
                className={selectedEmotions.includes(e) ? 'active' : ''}
                onClick={() => toggleEmotion(e)}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <div className="single-filter">
          <label>קטגוריות</label>
          <div className="filter-options">
            <button
              type="button"
              className={selectedCategories.length === 0 ? 'active' : ''}
              onClick={() => setSelectedCategories([])}
            >
              הכל
            </button>
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                className={selectedCategories.includes(c) ? 'active' : ''}
                onClick={() => toggleCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="single-filter">
          <label>תצוגה</label>
          <div className="filter-options">
            <button
              type="button"
              className={view === 'snippet' ? 'active' : ''}
              onClick={() => setView('snippet')}
            >
              מקטע
            </button>
            <button
              type="button"
              className={view === 'citation' ? 'active' : ''}
              onClick={() => setView('citation')}
            >
              ציטוט
            </button>
            <button
              type="button"
              className={view === 'title' ? 'active' : ''}
              onClick={() => setView('title')}
            >
              כותרת
            </button>
          </div>
        </div>
      </div>

     
        <div className="text-gallery" ref={galleryRef}>
          {filtered.map((text, i) => (
            <TextCard key={i} text={text} index={i} view={view} />
          ))}
        </div>
       
        <div className="gallery-progress">
          {Array.from({ length: totalCards - visibleCards + 1 }, (_, i) => (
            <span key={i} className={i === scrollIndex ? 'active' : ''}>*</span>
          ))}
        </div>
    </main>
  );
};

export default GalleryPage;
