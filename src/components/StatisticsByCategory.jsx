

import React, { useState } from "react";
import "./StatisticsByCategory.css";
import SingleStatistic from "./SingleStatistic";

function getPercent(stat) {
  return Number(stat.percent);
}

function getFilledGridBackground(percent, color, gridSize = 20) {
  const total = 12**2;
  const filled = Math.round((percent / 100) * total);
  const layers = [];

  for (let i = 0; i < filled; i++) {
    const row = Math.floor(i / 12);
    const col = i % 12;
    layers.push(
      `linear-gradient(${color}80 0 0) no-repeat ${col * gridSize}px ${row * gridSize}px / ${gridSize}px ${gridSize}px`
    );
  }

  return layers.join(", ");
}

const GRID_SIZE = 20; // px

const StatisticsByCategory = ({ category, label, statistics, indx }) => {
  const [selectedIdx, setSelectedIdx] = useState(null);

  if (!statistics.length) {
    return <p style={{ padding: 32 }}>בחר קטגוריה להצגת נתונים</p>;
  }

  const selectedStat = statistics[selectedIdx] ?? statistics[0];
  const percent = Number(selectedStat.percent);
  const color = selectedStat.color;

  // Math paper grid background
  const mathPaperBg = `
    repeating-linear-gradient(0deg, #e0e0e0 0, #e0e0e0 1px, transparent 1px, transparent ${GRID_SIZE}px),
    repeating-linear-gradient(90deg, #e0e0e0 0, #e0e0e0 1px, transparent 1px, transparent ${GRID_SIZE}px)
  `;

  // Filled squares background
  const filledBg = getFilledGridBackground(percent, color, GRID_SIZE);

  // Combine backgrounds: filled squares on top, math paper grid below
  const sectionBg = filledBg
    ? `${filledBg}, ${mathPaperBg}`
    : mathPaperBg;

   return (
    <section className="stat-category-section">
        {statistics.map((stat, idx) => (
          <SingleStatistic
            key={idx}
            statistic={stat}
            onClick={() => setSelectedIdx(idx)}
          />
        ))}
    </section>
  );
};

export default StatisticsByCategory;