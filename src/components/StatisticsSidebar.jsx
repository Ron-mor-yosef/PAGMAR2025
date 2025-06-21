import React from "react";
import "./StatisticsSidebar.css";




function Sidebar({ statistics, onSelectStatistic, getSelectedStat }) {
    return (
        <aside className="statistics-sidebar">
            <ul>
                {Object.keys(statistics).map((category) => (
                    <li className={getSelectedStat() === category ? "statistics-sidebar-category active" : "statistics-sidebar-category"} key={category} onClick={() => onSelectStatistic(category)}
                        style={{ '--cat-color': statistics[category][0]?.color ?? '#000' }}
                    >
                        {/* left bracket & right bracket come from CSS */}
                        <span className="sidebar-dot"></span>
                        {category}
                    </li>
                ))}
            </ul>
        </aside>
    );
}

export default Sidebar;