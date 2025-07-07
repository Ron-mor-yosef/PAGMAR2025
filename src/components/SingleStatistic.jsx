import React, { useState } from "react";
import "./SingleStatistic.css";

function isTransperent (percentIndx, percent, color) {
    const total = 12 ** 2;
    const filled = total - Math.round((percent / 100) * total);
    return percentIndx >= filled ? 1 : 0

}

function SingleStatistic({ statistic }) {
    return (
        <section className="single-statistic">
            <div className="single-statistic-grid">
                <div className="on-hover-source">
                    {statistic.source}
                </div>
                {Array.from({ length: 12 * 12 }).map((_, percentIndx) => {
                    return (
                        <img
                            className="single-percent"
                            src={`/assets/images/squares/${Math.ceil(Math.random() * 6)}.png`}
                            key={percentIndx}
                            style={{
                                rotate: `${(Math.ceil(Math.random() * 3) * 90) + (Math.random() * 3)}deg`,
                                borderColor: 'transparent',
                                opacity: isTransperent(percentIndx, statistic.percent, statistic.color)
                            }}
                        />
                    );
                })}
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