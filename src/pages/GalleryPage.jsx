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
  const [emotionIcons, setEmotionIcons] = useState({});
  const [categoryIcons, setCategoryIcons] = useState({});
  const [allEmotionIcon, setAllEmotionIcon] = useState(Math.floor(Math.random() * 3) + 1);
  const [allCategoryIcon, setAllCategoryIcon] = useState(Math.floor(Math.random() * 3) + 1);
  const [viewIcons, setViewIcons] = useState({
    snippet: Math.floor(Math.random() * 3) + 1,
    citation: Math.floor(Math.random() * 3) + 1,
    title: Math.floor(Math.random() * 3) + 1,
  });
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
    setSelectedEmotions((prev) => {
      if (prev.includes(emotion)) {
        // Remove emotion and its icon
        const { [emotion]: _, ...rest } = emotionIcons;
        setEmotionIcons(rest);
        return prev.filter(e => e !== emotion);
      } else {
        // Add emotion and assign a random icon index (1-3)
        setEmotionIcons({
          ...emotionIcons,
          [emotion]: Math.floor((Math.random() + 1) * 3)
        });
        return [...prev, emotion];
      }
    });
  };

  const toggleCategory = (category) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        const { [category]: _, ...rest } = categoryIcons;
        setCategoryIcons(rest);
        return prev.filter(c => c !== category);
      } else {
        setCategoryIcons({
          ...categoryIcons,
          [category]: Math.floor(Math.random() * 3) + 1
        });
        return [...prev, category];
      }
    });
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

  const visibleCards = 3; // How many cards fit in the viewport (adjust as needed)
  const totalCards = filtered.length;


  return (
    <main>
      <div className="gallery-filters">
        <div className='count-filter'> <label>[ {filtered.length} ] </label></div>
        <div className="single-filter">
          <label>רגשות</label>
          <div className="filter-options">
            <button
              type="button"
              className={selectedEmotions.length === 0 ? 'active' : ''}
              style={
                selectedEmotions.length === 0
                  ? { '--svg-url-emotion': `url('/assets/images/red_circles/${allEmotionIcon}.svg')` }
                  : {}
              }
              onClick={() => {
                setSelectedEmotions([]);
                setAllEmotionIcon(Math.floor(Math.random() * 3) + 1); // new random on click
              }}
            >
              הכל
            </button>
            {emotions.map((e) => (
              <>
                <button
                  key={e}
                  type="button"
                  className={selectedEmotions.includes(e) ? 'active' : ''}
                  data-svg-type="emotion"
                  style={
                    selectedEmotions.includes(e)
                      ? {
                        '--svg-url-emotion': `url('/assets/images/red_circles/${emotionIcons[e] || 1}.svg')`
                      }
                      : {}
                  }
                  onClick={() => toggleEmotion(e)}
                >
                  {e}
                </button>
                <label> / </label>
              </>
            ))}
          </div>
        </div>

        <div className="single-filter">
          <label>נושאים</label>
          <div className="filter-options">
            <button
              type="button"
              className={selectedCategories.length === 0 ? 'active' : ''}
              style={
                selectedCategories.length === 0
                  ? { '--svg-url-category': `url('/assets/images/red_circles/${allCategoryIcon}.svg')` }
                  : {}
              }
              onClick={() => {
                setSelectedCategories([]);
                setAllCategoryIcon(Math.floor(Math.random() * 3) + 1); // new random on click
              }}
            >
              הכל
            </button>
            {categories.map((c) => (
              <>
              <div> / </div>
                <button
                  key={c}
                  type="button"
                  className={selectedCategories.includes(c) ? 'active' : ''}
                  data-svg-type="category"
                  style={
                    selectedCategories.includes(c)
                      ? {
                        '--svg-url-category': `url('/assets/images/red_circles/${categoryIcons[c] || 1}.svg')`
                      }
                      : {}
                  }
                  onClick={() => toggleCategory(c)}
                >
                  {c}
                </button>
              </>
            ))}
          </div>
        </div>

        <div className="single-filter">
          <label>תצוגה</label>
          <div className="filter-options">
            {['snippet', 'citation', 'title'].map((v) => (
              <button
                key={v}
                type="button"
                className={view === v ? 'active' : ''}
                style={
                  view === v
                    ? { '--svg-url-view': `url('/assets/images/red_circles/${viewIcons[v]}.svg')` }
                    : {}
                }
                onClick={() => {
                  setView(v);
                  setViewIcons((prev) => ({
                    ...prev,
                    [v]: Math.floor(Math.random() * 3) + 1 // new random on click
                  }));
                }}
                data-svg-type="view"
              >
                {v === 'snippet' ? 'מקטע' : v === 'citation' ? 'ציטוט' : 'כותרת'}
              </button>
            ))}
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
