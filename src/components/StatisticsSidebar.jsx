import React from "react";
import "./StatisticsSidebar.css";





import { useState } from "react";

function Sidebar({ statistics, onSelectStatistic, getSelectedStat }) {
    // Track a random dot image for each selected category
    const [dotImages, setDotImages] = useState({});

    const handleSelect = (category) => {
        setDotImages((prev) => {
            if (prev[category]) return prev;
            const randomIdx = Math.ceil(Math.random() * 5);
            const url = process.env.PUBLIC_URL + `/assets/images/dots/${randomIdx}.png`;
            return { ...prev, [category]: url };
        });
        onSelectStatistic(category);
    };

    return (
        <aside className="statistics-sidebar">
            <ul>
                {Object.keys(statistics).map((category) => {
                    const isActive = getSelectedStat() === category;
                    // If active and not set, pick a new one
                    let style = {};
                    if (isActive) {
                        if (!dotImages[category]) {
                            const randomIdx = Math.ceil(Math.random() * 5);
                            style['--cat-selection'] = `url('${process.env.PUBLIC_URL}/assets/images/dots/${randomIdx}.png')`;
                        } else {
                            style['--cat-selection'] = `url('${dotImages[category]}')`;
                        }
                    }
                    return (
                        <li
                            className={isActive ? "statistics-sidebar-category active" : "statistics-sidebar-category"}
                            key={category}
                            onClick={() => handleSelect(category)}
                            style={style}
                        >
                            {/* left bracket & right bracket come from CSS */}
                            <span className="sidebar-dot"></span>
                            {category}
                        </li>
                    );
                })}
            </ul>
        </aside>
    );
}

export default Sidebar;