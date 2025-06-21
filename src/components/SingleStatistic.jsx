import React, { useState } from "react";
import "./SingleStatistic.css";


function getPercent(stat) {
    return Number(stat.percent);
}
function getfilledColor(percentIndx, percent, color) {
    const total = 12 ** 2;
    const filled = total - Math.round((percent / 100) * total);
    return percentIndx >= filled ? color : '#FFFBF2'

}
const GRID_SIZE = 20;

function SingleStatistic({ statistic }) {
    return (
        <section className="single-statistic">
            <div className="single-statistic-grid">
                <div className="on-hover-source">
                    {statistic.source}
                </div>
                {Array.from({ length: 12 * 12 }).map((_, percentIndx) => (
                    <div className="single-percent" key={percentIndx} style={{
                        background: getfilledColor(percentIndx, statistic.percent, statistic.color)
                    }} />
                ))}
                <span className="single-stat-percent">{statistic.percent}%</span>
            </div>
            <div>
            </div>
            <div className="single-stat-explain">
                {statistic.explanation}
            </div>
        </section >
    );
}

export default SingleStatistic;