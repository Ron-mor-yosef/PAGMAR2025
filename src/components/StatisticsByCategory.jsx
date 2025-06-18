

import React, { useState } from "react";
import "./StatisticsByCategory.css";

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

  const selectedStat = selectedIdx !== null ? statistics[selectedIdx] : null;
  const percent = selectedStat ? getPercent(selectedStat) : 0;
  const color = "#5678FF";

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
    <section
      className="stat-category-section"
      style={{
        "--grid-size": `${GRID_SIZE}px`,
        background: mathPaperBg,
        backgroundRepeat: "no-repeat, repeat, repeat",
        backgroundPosition: `center center, left top, left top`,
      }}
    >
      <div className="stat-category-grid">
        {/* Left: Statistic label */}
        <div className="stat-category-left">
          {selectedStat ? (
            <>
              <div className="stat-percent-value">
                {selectedStat.percent}%
              </div>
              <div className="stat-percent-desc">{selectedStat.explanation}</div>
            </>
          ) : (
            null
          )}
        </div>
        {/* Center: 10x10 grid area (empty, grid is in background) */}
        <div className="stat-category-center" style={{
          width: `calc(${GRID_SIZE}px * 12)`,
          height: `calc(${GRID_SIZE}px * 12)`,
          border: ` solid 1px #22222240`,
          margin: `${GRID_SIZE*2}px 0`,
          background: filledBg,
          backgroundRepeat: "no-repeat, repeat, repeat",
          backgroundPosition: `center center, left top, left top`,
        }} />
        {/* Right: Checkboxes */}
        <div className="stat-category-right">
          <ul className="stat-list">
            <div className="stat-category-title">{indx}. {label}            </div>

              {statistics.map((stat, idx) => (
                <li key={idx} className="stat-list-item">
                  <label className="custom-checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedIdx === idx}
                      onChange={() => setSelectedIdx(idx === selectedIdx ? null : idx)}
                      id={`stat-${category}-${idx}`}
                    />
                    <span className="custom-checkbox-svg" style={{ position: 'relative', display: 'inline-block' }}>
                      {/* Always render unchecked SVG */}
                      <img src="/assets/images/checkbox/unchecked.svg" alt="unchecked" />

                      {/* Conditionally render checked SVG on top */}
                      {selectedIdx === idx && (
                        <img
                          src="/assets/images/checkbox/checked.svg"
                          alt="checked"
                          style={{
                            position: 'absolute',
                            rotate: `${Math.round(Math.random()*30)}deg`,
                            top: -14,
                            left: 4,
                          }}
                        />
                      )}
                    </span>

                    <span>{stat.explanation}</span>
                  </label>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default StatisticsByCategory;