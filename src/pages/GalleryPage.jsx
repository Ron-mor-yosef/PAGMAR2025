import React, { useEffect, useRef, useState } from "react";
import { loadCSV } from "../utils/parseCSV";
import TextCard from "../components/TextCard";
import FloatingInfoBox from "../components/FloatingInfoBox";
import "./GalleryPage.css";

const GalleryPage = () => {
  const [texts, setTexts] = useState([]);
  const [view, setView] = useState("snippet");
  const [emotions, setEmotions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [emotionIcons, setEmotionIcons] = useState({});
  const [categoryIcons, setCategoryIcons] = useState({});
  // const [emotionColors, setEmotionColors] = useState({});
  // const [allEmotionIcon, setAllEmotionIcon] = useState(Math.floor(Math.random() * 3) + 1);
  // const [allCategoryIcon, setAllCategoryIcon] = useState(Math.floor(Math.random() * 3) + 1);
  // const [viewIcons, setViewIcons] = useState({
  //   snippet: Math.floor(Math.random() * 3) + 1,
  //   citation: Math.floor(Math.random() * 3) + 1,
  //   title: Math.floor(Math.random() * 3) + 1,
  // });
  const galleryRef = useRef(null);
  const [scrollIndex, setScrollIndex] = useState(0);
  const [floatingInfo, setFloatingInfo] = useState(null);
  const [selectedText, setSelectedText] = useState(null);
  const [boxPos, setBoxPos] = useState(null);
  const [openBoxes, setOpenBoxes] = useState([]);
  const [nextZIndex, setNextZIndex] = useState(1001);
  const [twitchIndexes, setTwitchIndexes] = useState([]);
  const [filterOptionRotation, setFilterOptionsRotates] = useState({});

  useEffect(() => {
    loadCSV("/texts_new2.csv").then((data) => {
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
      selectedEmotions.some((e) => textEmotions.includes(e));

    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.some((c) => textCategories.includes(c));

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
          position: { x: event.clientX, y: event.clientY },
          zIndex: nextZIndex,
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

  // Twitch effect: randomly pick cards to twitch every 2 seconds
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (filtered.length === 0) return;
  //     // Pick 1-2 random indexes to twitch
  //     const count = Math.floor(Math.random() * 2) + 1;
  //     const indexes = [];
  //     for (let i = 0; i < count; i++) {
  //       indexes.push(Math.floor(Math.random() * filtered.length));
  //     }
  //     setTwitchIndexes(indexes);
  //     // Remove twitch after animation duration
  //     setTimeout(() => setTwitchIndexes([]), 350);
  //   }, 2000);
  //   return () => clearInterval(interval);
  // }, [filtered.length]);

  return (
    <main className="gallery-page">
      <div className="gallery-header">
        <div className="gallery-filters">
          <div className="count-filter">
            {" "}
            <label>[ {filtered.length} ] </label>
          </div>
          <div className="single-filter emotions-filter">
            <label>רגשות</label>
            <div className="filter-options">
              {/* <button
                type="button"
                className={selectedEmotions.length === 0 ? "active" : ""}
                style={
                  selectedEmotions.length === 0
                    ? { "--svg-url-emotion": `url('/assets/images/red_circles/${allEmotionIcon}.svg')` }
                    : {}
                }
                onClick={() => {
                  setSelectedEmotions([]);
                  setAllEmotionIcon(Math.floor(Math.random() * 3) + 1); // new random on click
                }}
              >
                הכל
              </button> */}
              {emotions.map((e, idx) => (
                <>
                  {idx > 0 ? (
                    <label>/</label>
                  ) : null}
                  <button
                    key={e}
                    type="button"
                    className={selectedEmotions.includes(e) ? "active" : ""}
                    data-svg-type="emotion"
                    style={
                      selectedEmotions.includes(e)
                        ? {
                          "--svg-url-emotion": `url('/assets/images/red_circles/${emotionIcons[e] || 1}.svg')`,
                          "--circle-rotate": filterOptionRotation[e] || "0deg"
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
              {/* <button
              type="button"
              className={selectedCategories.length === 0 ? "active" : ""}
              style={
                selectedCategories.length === 0
                  ? { "--svg-url-category": `url('/assets/images/red_circles/${allCategoryIcon}.svg')` }
                  : {}
              }
              onClick={() => {
                setSelectedCategories([]);
                setAllCategoryIcon(Math.floor(Math.random() * 3) + 1); // new random on click
              }}
            >
              הכל
            </button> */}
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
                          "--svg-url-category": `url('/assets/images/red_circles/${categoryIcons[c] || 1}.svg')`,
                          "--circle-rotate": filterOptionRotation[c] || "0deg"

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

          {/* <div className="single-filter">
          <label>תצוגה</label>
          <div className="filter-options">
            {["snippet", "citation", "title"].map((v) => (
              <button
                key={v}
                type="button"
                className={view === v ? "active" : ""}
                style={
                  view === v
                    ? { "--svg-url-view": `url('/assets/images/red_circles/${viewIcons[v]}.svg')` }
                    : {}
                }
                onClick={() => {
                  setView(v);
                  setViewIcons((prev) => ({
                    ...prev,
                    [v]: Math.floor(Math.random() * 3) + 1, // new random on click
                  }));
                }}
                data-svg-type="view"
              >
                {v === "snippet" ? "מקטע" : v === "citation" ? "ציטוט" : "כותרת"}
              </button>
            ))}
          </div>
        </div> */}
        </div>
      </div>
      <div
        className="text-gallery"
        ref={galleryRef}
      // style={{
      //   filter: openBoxes.length > 0 ? `blur(${(openBoxes.length * 0.9)}px)` : "none",
      //   opacity: openBoxes.length > 0
      //     ? Math.max(1 - openBoxes.length * 0.02, 0.25)
      //     : 1,
      //   transition: "filter 0.5s, opacity 0.5s"
      // }}
      >
        {filtered.map((text, i) => (
          <TextCard
            key={i}
            text={text}
            index={i}
            onCardClick={handleCardClick}
            twitch={twitchIndexes.includes(i)}
          />
        ))}
      </div>

      {openBoxes.map((box) => (
        <FloatingInfoBox
          key={box.id}
          text={box.text}
          position={box.position}
          zIndex={box.zIndex}
          onClose={() => handleCloseBox(box.id)}
          onFocus={() => handleFocusBox(box.id)}
          extraQuotes={texts
            .filter(t => t.index !== box.text.index)
            .slice(0, 5)
            .map(t => ({
              index: t.index,
              text: t['הטקסט'] || "",
              author: t['שם כותבת'] || "ללא שם"
            }))}
          onOpenNewBox={(quote, location) => handleCardClick(texts[quote.index], location)}
        />
      ))}
    </main>
  );
};

export default GalleryPage;
