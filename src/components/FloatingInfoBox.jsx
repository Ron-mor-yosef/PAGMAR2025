import React, { useRef, useState, useEffect } from "react";
import "./FloatingInfoBox.css";
import { processTaggedText } from "../utils/parseCSV"; // Adjust the import path as necessary
// FloatingInfoBox.jsx  (put just above the component or inside it)
const clampToViewport = (x, y, boxEl) => {
    if (!boxEl) return { x, y };

    const { offsetWidth: w, offsetHeight: h } = boxEl;
    const maxX = window.innerWidth - w;
    const maxY = window.innerHeight - h;

    return {
        x: Math.max(0, Math.min(x, maxX)),
        y: Math.max(0, Math.min(y, maxY)),
    };
};


const FloatingInfoBox = ({ text, position, onClose, zIndex, onFocus, suggestions = [], onOpenNewBox }) => {
    const boxRef = useRef(null);
    const [dragging, setDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [boxPos, setBoxPos] = useState(position);
    const [collapsed, setCollapsed] = useState(false);
    const [activeTags, setActiveTag] = useState([]);

    useEffect(() => {
        setBoxPos(position);
    }, [position]);

    // after the other useEffects
    useEffect(() => {
        const fit = () => setBoxPos(prev => clampToViewport(prev.x, prev.y, boxRef.current));
        fit();                       // run once after mount
        window.addEventListener('resize', fit);
        return () => window.removeEventListener('resize', fit);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (dragging) {
                setBoxPos(
                    clampToViewport(e.clientX - offset.x, e.clientY - offset.y, boxRef.current)
                );
            }
        };
        const handleMouseUp = () => setDragging(false);

        if (dragging) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        }
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [dragging, offset]);

    const startDrag = (e) => {
        if (boxRef.current) {
            const rect = boxRef.current.getBoundingClientRect();
            setOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
            setDragging(true);
        }
    };

    const isValidSuggestion = (quote, activeTags) => {
        // If no tags are active, show all quotes
        if (activeTags.length === 0) return true;

        // Check if the quote has any tags that match the active tags
        const quoteTags = quote.tags || [];
        return activeTags.every(tag => quoteTags.includes(tag));
    };

    // const highlightCategories = (text, activeTags) => {
    //     return text.replace(
    //         /<קטגוריה:\s*([^>]+)>([\s\S]*?)<\/?\s*קטגוריה(:)?\s*[^>]*>/g,
    //         (match, cat, content) => {
    //             const trimmedCat = cat.trim();
    //             const className = `highlight-category ${trimmedCat}${activeTags.includes(trimmedCat) ? " active" : ""}`;
    //             return `<span class="${className}">${content}</span>`;
    //         }
    //     );
    // };

    // const highlightEmotion = (text, activeTags) => {
    //     return text.replace(
    //         /<רגש:\s*([^>]+)>([\s\S]*?)<\/?\s*רגש(:)?\s*[^>]*>/g,
    //         (match, emo, content) => {
    //             const trimmedEmo = emo.trim();
    //             const className = `highlight-emotion ${trimmedEmo}${activeTags.includes(trimmedEmo) ? " active" : ""}`;
    //             return `<span class="${className}">${content}</span>`;
    //         }
    //     );
    // };

    // const highlightTags = (text, activeTags) => {
    //     const categoryText = highlightCategories(text, activeTags);
    //     return highlightEmotion(categoryText, activeTags);
    // };
    const highlightTags = (text, activeTags) => {
        return processTaggedText(text, activeTags);
    };

    return (

        <div
            ref={boxRef}
            className="floating-info-box"
            style={{
                top: boxPos?.y,
                left: boxPos?.x,
                zIndex: zIndex,
            }}
            onMouseDown={(e) => {
                onFocus && onFocus();
                startDrag(e);
            }}
        >
            {/* Always show close button */}
            <button className="floating-info-box-close" onClick={onClose}>
                ×
            </button>

            {/* Slide up/hide main content when collapsed */}
            <div className={`floating-info-box-main${collapsed ? " collapsed" : ""}`}>
                <div className="floating-info-box-header">
                    <span className="floating-info-box-title">
                        {text['כותרת'] ? text['כותרת'] : "ללא כותרת"} / {text['שם כותבת'] || "ללא שם"}
                    </span>
                </div>
                <div className="make-scrollbar-right">
                    <p className="floating-info-box-content"
                        dangerouslySetInnerHTML={{
                            __html: highlightTags(
                                (text['הטקסט'] || "")
                                    .split(/\r?\n/g)
                                    .map(line => line.trim())
                                    .join('<br>'),
                                activeTags
                            )
                        }}
                    />
                </div>
            </div>

            {/* Filters and extra button always visible, move up when collapsed */}
            <div className={`floating-info-box-filters${collapsed ? " collapsed" : ""}`}>
                <div className="tags" style={{ borderLeft: "#222222 0.6px solid", margin: "0 0.5rem 0 0.1rem" }}>

                    <label>נושא </label>
                    <ul>
                        {text['קטגוריה']?.split(/,|\r|\n/g).map((category, i) => (
                            <li
                                key={i}
                                className={`highlight-category ${activeTags.includes(category.trim()) ? `${category.trim()} active` : ""}`}
                                onClick={() => setActiveTag((prev) => {
                                    if (prev.includes(category.trim())) {
                                        return prev.filter(tag => tag !== category.trim());
                                    } else {
                                        return [...prev, category.trim()];
                                    }
                                })}
                            >
                                {category.trim()}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="tags" style={{ margin: "0 0.5rem 0 0.7rem" }}>
                    <label >רגש </label>

                    <ul>
                        {text['רגש']?.split(/,|\r|\n/g).map((emotion, i) => (
                            <li key={i} className={`highlight-emotion ${activeTags.includes(emotion.trim()) ? `${emotion.trim()} active` : ""}`}
                                onClick={() => setActiveTag((prev) => {
                                    if (prev.includes(emotion.trim())) {
                                        return prev.filter(tag => tag !== emotion.trim());
                                    } else {
                                        return [...prev, emotion.trim()];
                                    }
                                })}>
                                {emotion.trim()}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div
                className={`floating-info-box-extra${collapsed ? " expanded" : ""}`}
                onClick={() => setCollapsed((prev) => !prev)}
            >
                <span>
                    {collapsed ? "- טקסטים נוספים" : "+ טקסטים נוספים"}
                </span>
            </div>

            {/* Show the list of texts only when collapsed/expanded */}
            {collapsed && (
                <div className="extra-quotes-list">
                    <ul>
                        <div className="make-scrollbar-right ">

                            {suggestions.length > 0 ? (
                                suggestions.filter(q => isValidSuggestion(q, activeTags)).slice(0, 7).map((q, i) => (
                                    <li
                                        key={q.index}
                                        className="extra-quote-item"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onOpenNewBox(q, { clientX: e.clientX, clientY: e.clientY }); // Pass the quote object (should include row index/id)
                                        }}
                                    >
                                        <div className="quote-content">
                                            <p className="content" dangerouslySetInnerHTML={{
                                                __html: processTaggedText(
                                                    (q.text || "")
                                                        .split(/\r?\n/g)
                                                        .map(line => line.trim())
                                                        .join('<br>'), [])
                                            }} />
                                        </div>
                                        <div className="author">{q.author}</div>
                                    </li>
                                ))
                            ) : (
                                <li>אין ציטוטים נוספים</li>
                            )}
                        </div>

                    </ul>
                </div>
            )}
        </div>
    );
};

export default FloatingInfoBox;