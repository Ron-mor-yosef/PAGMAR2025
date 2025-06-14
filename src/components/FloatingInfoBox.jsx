import React, { useRef, useState, useEffect } from "react";
import "./FloatingInfoBox.css";

const FloatingInfoBox = ({ text, position, onClose, zIndex, onFocus, extraQuotes = [], onOpenNewBox }) => {
    const boxRef = useRef(null);
    const [dragging, setDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [boxPos, setBoxPos] = useState(position);
    const [collapsed, setCollapsed] = useState(false);
    const [activeTags, setActiveTag] = useState([]);

    useEffect(() => {
        setBoxPos(position);
    }, [position]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (dragging) {
                setBoxPos({
                    x: e.clientX - offset.x,
                    y: e.clientY - offset.y,
                });
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

    const highlightCategories = (text, activeTags) => {
        // Regex to match <קטגוריה: ...> ... </קטגוריה>
        return text.replace(/קטגוריה: ([^>]+)([\s\S]*?)קטגוריה/g, (match, cat, content) => {
            const className = `highlight-category ${cat}`;
            // Only highlight if this category is active
            if (activeTags.includes(cat.trim())) {
                return `span class="${className} active"${content}/span`;
            }
            return `span class="${className}"${content}/span`;
        });
    };
    const highlightEmotion = (text, activeTags ) => {
        // Regex to match <רגש: ...> ... </רגש>
        return text.replace(/רגש: ([^>]+)([\s\S]*?)רגש/g, (match, emo, content) => {
            const className = `highlight-emotion ${emo.trim()}`;
            // Only highlight if this emotion is active
            if (activeTags.includes(emo.trim())) {
                return `span class="${className} active"${content}/span`;
            }
            return `span class="${className}"${content}/span`;
        });
    };
    const highlightTags = (text, activeTags) => {
        // Highlight categories
        const categoryText = highlightCategories(text, activeTags);
        // Highlight emotions
        return highlightEmotion(categoryText, activeTags);
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
                    {/* <p className="floating-info-box-content">
                        {
                            text['הטקסט']?.split(/\r|\n/g).map((line, i) =>
                                <div key={i} dangerouslySetInnerHTML={{
                                    __html: highlightTags(line.trim(), activeCategory)
                                }}></div>)}
                    </p> */}
                    <p className="floating-info-box-content"
                        dangerouslySetInnerHTML={{
                            __html: highlightTags(
                                (text['הטקסט'] || "")
                                    .split(/\r?\n/)
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
                <div className="tags">

                    <label>נושאים |</label>
                    <ul className="tags">
                        {text['קטגוריה']?.split(/,|\r|\n/g).map((category, i) => (
                            <li
                                key={i}
                                className={`category-tag ${activeTags.includes(category.trim()) ? `${category.trim()} active` : ""}`}
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
                <div className="tags">
                    <label>רגשות |</label>
                    <ul>
                        {text['רגש']?.split(/,|\r|\n/g).map((emotion, i) => (
                            <li key={i} className={`emotion-tag ${activeTags.includes(emotion.trim()) ? `${emotion.trim()} active` : ""}`}
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

                            {extraQuotes.length > 0 ? (
                                extraQuotes.map((q, i) => (
                                    <li
                                        key={q.index}
                                        className="extra-quote-item"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onOpenNewBox(q, { clientX: e.clientX, clientY: e.clientY }); // Pass the quote object (should include row index/id)
                                        }}
                                    >
                                        <div className="content" dangerouslySetInnerHTML={{ __html: q.text.slice(0, 100)?.replace(/\r+\n+/g, "<br>") }}></div>
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