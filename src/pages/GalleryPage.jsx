import React, { useEffect, useRef, useState } from "react";
import { loadCSV } from "../utils/parseCSV";
import TextCard from "../components/TextCard";
import FloatingInfoBox from "../components/FloatingInfoBox";
import "./GalleryPage.css";
import { motion } from 'framer-motion';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 30
  },
  in: {
    opacity: 1,
    y: 0
  },
  out: {
    // opacity: 0,
    // y: -30
  }
};

const pageTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.5
};

const GalleryPage = () => {
  const [texts, setTexts] = useState([]);
  const [view, setView] = useState("snippet");
  const [emotions, setEmotions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [emotionIcons, setEmotionIcons] = useState({});
  const [categoryIcons, setCategoryIcons] = useState({});
  const galleryRef = useRef(null);
  const [openBoxes, setOpenBoxes] = useState([]);
  const [nextZIndex, setNextZIndex] = useState(1001);
  const [filterOptionRotation, setFilterOptionsRotates] = useState({});
  const [closingAll, setClosingAll] = useState(false);

  useEffect(() => {
    // loadCSV("/texts_new2.csv").then((data) => {
    loadCSV(process.env.PUBLIC_URL + "/texts_new2_aligned.csv").then((data) => {
      // Add index property to each row
      const dataWithIndex = data.map((row, idx) => ({ ...row, index: idx }));
      setTexts(dataWithIndex);

      // Extract unique emotions
      const allEmotions = [
        ...new Set(
          dataWithIndex.flatMap((t) =>
            (t["רגש"] || "")
              .split(/,|\n/)
              .map((e) => e.trim())
              .filter(Boolean)
          )
        ),
      ];
      setEmotions(allEmotions);

      // Extract unique categories
      const allCategories = [
        ...new Set(
          dataWithIndex.flatMap((t) =>
            (t["קטגוריה"] || "")
              .split(/,|\n/)
              .map((e) => e.trim())
              .filter(Boolean)
          )
        ),
      ];
      setCategories(allCategories);
    });
  }, []);

  // Multi-selection toggle logic
  const toggleEmotion = (emotion) => {
    const colors = {};
    // Generate a random color for the emotion
    setSelectedEmotions((prev) => {

      if (prev.includes(emotion)) {
        // Remove emotion and its icon
        const { [emotion]: _, ...rest } = emotionIcons;
        setEmotionIcons(rest);
        return prev.filter((e) => e !== emotion);
      } else {
        // Add emotion and assign a random icon index (1-5)
        setEmotionIcons({
          ...emotionIcons,
          [emotion]: Math.floor((Math.random() * 5) + 1),
        });
        setFilterOptionsRotates((prev) => ({
          ...prev,
          [emotion]: `${Math.random() * 10 - 5}deg`
        }));
        return [...prev, emotion];
      }
    });
  };

  const toggleCategory = (c) => {
    setSelectedCategories((prev) => {
      if (prev.includes(c)) {
        // Remove emotion and its icon
        const { [c]: _, ...rest } = categoryIcons;
        setCategoryIcons(rest);
        return prev.filter((e) => e !== c);
      } else {
        // Add emotion and assign a random icon index (1-5)
        setCategoryIcons({
          ...categoryIcons,
          [c]: Math.floor((Math.random() * 5) + 1),
        });
        setFilterOptionsRotates((prev) => ({
          ...prev,
          [c]: `${Math.random() * 10 - 5}deg`
        }));
        return [...prev, c];
      }
    });


  };

  // Filtering logic for multi-selection
  const filtered = texts.filter((t) => {
    const textEmotions = (t["רגש"] || "").split(/,|\n/g).map((e) => e.trim()).filter(Boolean);
    const textCategories = (t["קטגוריה"] || "").split(/,|\n/g).map((e) => e.trim()).filter(Boolean);

    const emotionMatch =
      selectedEmotions.length === 0 ||
      selectedEmotions.every((e) => textEmotions.includes(e));

    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.every((c) => textCategories.includes(c));

    return emotionMatch && categoryMatch;
  });

  const visibleCards = 3; // How many cards fit in the viewport (adjust as needed)
  const totalCards = filtered.length;

  const handleCardClick = (memory, event) => {
    setOpenBoxes((prev) => {
      // Use the row index as the unique key
      const uniqueKey = memory.index;
      // Remove any existing box for this text
      const filtered = prev.filter((box) => box.text.index !== uniqueKey);
      // Add the new box at the clicked spot
      return [
        ...filtered,
        {
          id: Date.now() + Math.random(),
          text: memory,
          position: { x: event.clientX-220, y: event.clientY-200 },
          zIndex: nextZIndex,
          randHeight: Math.round(Math.random()*3)
        },
      ];
    });
    setNextZIndex((z) => z + 1);
  };

  const handleCloseBox = (id) => {
    setOpenBoxes((prev) => prev.filter((box) => box.id !== id));
  };

  const handleFocusBox = (id) => {
    setOpenBoxes((prev) =>
      prev.map((box) =>
        box.id === id ? { ...box, zIndex: nextZIndex } : box
      )
    );
    setNextZIndex((z) => z + 1);
  };

  const topZIndex = openBoxes.length > 0 ? Math.max(...openBoxes.map(box => box.zIndex)) : 0;

  const handleCloseAll = () => {
    setClosingAll(true);
    // Remove all after animation duration (match your CSS, e.g. 220ms)
    setTimeout(() => {
      setOpenBoxes([]);
      setClosingAll(false);
    }, 220);
  };

  return (
     <motion.main
      className="gallery-page"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
            {openBoxes.length > 0 && (
  <button
    className="close-all-floating-btn"
    onClick={handleCloseAll} // <-- use the new handler
  >
    <img src={process.env.PUBLIC_URL + "/assets/images/close.svg"} alt="סגור" />
    סגור הכל
  </button>
)}
      {/* Smudg overlay */}
      <div
        className="smudge-overlay"
        style={{ "--smudge-intensity": `${openBoxes.length * 2}px` }}
      />

      <div className="gallery-header">
        <div className="gallery-filters">
          <div className="single-filter emotions-filter">
            <label>רגשות</label>
            <div className="filter-options">
              {emotions.map((e, idx) => (
                <>
                  {idx > 0 ? <label>/</label> : null}
                  <button
                    key={e}
                    type="button"
                    className={selectedEmotions.includes(e) ? "active" : ""}
                    data-svg-type="emotion"
                    style={
                      selectedEmotions.includes(e)
                        ? {
                          "--svg-url-emotion": `url('${process.env.PUBLIC_URL}/assets/images/red_circles/${emotionIcons[e] || 1}.svg')`,
                          "--circle-rotate": filterOptionRotation[e] || "0deg",
                          // If the red-circle icon 5 is selected, add an extra translateY offset:
                          "--after-bottom": emotionIcons[e] === 5 ? "-10%" : "10%",
                        }
                        : {}
                    }
                    onClick={() => toggleEmotion(e)}
                  >
                    {e}
                  </button>
                </>
              ))}
            </div>
          </div>

          <div className="single-filter category-filter">
            <label>נושאים</label>
            <div className="filter-options">
            
              {categories.map((c, idx) => (
                <>
                  {idx > 0 ? (
                    <label>/</label>
                  ) : null}
                  <button
                    key={c}
                    type="button"
                    className={selectedCategories.includes(c) ? "active" : ""}
                    data-svg-type="category"
                    style={
                      selectedCategories.includes(c)
                        ? {
                          "--svg-url-category": `url('${process.env.PUBLIC_URL}/assets/images/red_circles/${categoryIcons[c] || 1}.svg')`,
                          "--circle-rotate": filterOptionRotation[c] || "0deg",
                          "--after-bottom": categoryIcons[c] === 5 ? "-15%" : "10%"
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

        </div>
        <div className="gallery-buttom-header">
          <label className="count-filter">[ {filtered.length} ] </label>
            <ul className="gallery-active-tags">
              {[...selectedEmotions, ...selectedCategories].map(t =>
                <li> {t.trim()} </li>
              )}
            </ul>
        </div>
      </div>
      <div
        className="text-gallery"
        ref={galleryRef}
      >
        {filtered.map((text, i) => (
          <TextCard
            key={i}
            text={text}
            index={i}
            onCardClick={handleCardClick}
            selectedEmotions={selectedEmotions}
            selectedCategories={selectedCategories}
            emotionIcons={emotionIcons}
            categoryIcons={categoryIcons}
          />
        ))}
      </div>

      {openBoxes.map((box) => (
        <FloatingInfoBox
          key={box.id}
          randomHeigh={box.randHeight}
          text={box.text}
          position={box.position}
          zIndex={box.zIndex}
          topZIndex={topZIndex}
          onClose={() => handleCloseBox(box.id)}
          onFocus={() => handleFocusBox(box.id)}
          suggestions={texts
            .filter(t => t.index !== box.text.index)
            .map(t => ({
              index: t.index,
              text: t['הטקסט'] || "",
              author: t['שם כותבת'] || "ללא שם",
              tags: [
                ...(t['רגש'] || "").split(/,|\n|\r/).map(e => e.trim()).filter(Boolean),
                ...(t['קטגוריה'] || "").split(/,|\n|\r/).map(c => c.trim()).filter(Boolean)
              ]
            }))}
          onOpenNewBox={(quote, location) => handleCardClick(texts[quote.index], location)}
          initialActiveTag={
            [...selectedEmotions, ...selectedCategories].slice(-1)[0] || null
          }
          closingAll={closingAll} // <-- add this line
        />
      ))}
</motion.main>  );
};

export default GalleryPage;
