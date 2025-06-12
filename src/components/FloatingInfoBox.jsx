import React, { useRef, useState, useEffect } from "react";
import "./FloatingInfoBox.css";

const FloatingInfoBox = ({ text, position, onClose, zIndex, onFocus, extraQuotes = [] }) => {
    const boxRef = useRef(null);
    const [dragging, setDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [boxPos, setBoxPos] = useState(position);
    const [collapsed, setCollapsed] = useState(false);

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
            {/* Header and content slide up when collapsed */}
            <div className={`floating-info-box-main${collapsed ? " collapsed" : ""}`}>
                <div className="floating-info-box-header">
                    <button
                        className="floating-info-box-close"
                        onClick={onClose}
                    >
                        ×
                    </button>
                    <span className="floating-info-box-title">
                        {text['כותרת'] ? text['כותרת'] : "ללא כותרת"}
                        {" "} / {" "}
                        {text['שם כותבת'] || "ללא שם"}
                    </span>
                </div>
                <div className="make-scrollbar-right">
                    <p className="floating-info-box-content">
                        {text['הטקסט']?.split(/\r|\n/g).map((line, i) => <div key={i}>{line.trim()}</div>)}
                    </p>
                </div>
            </div>
            {/* Filters always visible */}
            <div className="floating-info-box-filters">
                <ul>
                    נושאים |
                    <li className="categories">
                        {text['קטגוריות']?.split(/,|\r/g).map((category, i) => (
                            <li key={i} className="category-tag">{category.trim()}</li>
                        ))}
                    </li>
                </ul>
                <ul>
                    רגשות |
                    <li className="emotions">
                        {text['רגשות']?.split(/,|\r/g).map((emotion, i) => (
                            <span key={i} className="emotion-tag">{emotion.trim()}</span>
                        ))}
                    </li>
                </ul>
            </div>
            {/* Extra quotes area */}
            <div
                className={`floating-info-box-extra${collapsed ? " expanded" : ""}`}
                onClick={() => setCollapsed((prev) => !prev)}
            >
                {!collapsed ? "+ טקסטים נוספים" : (
                    <div>
                        <strong>ציטוטים נוספים:</strong>
                        <ul>
                            {extraQuotes.length > 0 ? (
                                extraQuotes.map((q, i) => (
                                    <li key={i}>{q}</li>
                                ))
                            ) : (
                                <li>אין ציטוטים נוספים</li>
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FloatingInfoBox;