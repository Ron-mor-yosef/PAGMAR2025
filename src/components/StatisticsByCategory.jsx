import React, { useState } from "react";
import "./StatisticsByCategory.css";

// const COLORS = {
//   "נפש": "#4a90e2",
//   "גוף": "#7b61ff",
//   "זוגיות": "#00bfae",
//   "ילדים": "#ffb300",
//   "תעסוקה": "#b2dfdb",
// };

function getPercent(stat) {
  return Number(stat.percent);
}

// function PercentageGrid({ percent, color }) {
//   const total = 100;
//   const filled = Math.round((percent / 100) * total);
//   return (
//     <div className="percent-grid">
//       {[...Array(total)].map((_, i) => (
//         <div
//           key={i}
//           className="percent-cell"
//           style={{
//             background: i < filled ? color : "#fff",
//             border: "1px solid #e0e0e0",
//           }}
//         />
//       ))}
//     </div>
//   );
// }

function PercentageGrid({ percent, color }) {
  const total = 100;
  const filled = Math.round((percent / 100) * total);

  // Generate a shuffled array of indices (0..99)
  const shuffled = React.useMemo(() => {
    const arr = Array.from({ length: total }, (_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [percent, color]); // re-shuffle when percent or color changes

  return (
    <div className="percent-grid">
      {shuffled.map((idx, i) => (
        <div
          key={idx}
          className="percent-cell"
          style={{
            background: 100-i > filled ? "#fff" : color,
            border: "1px solid #e0e0e0",
          }}
        />
      ))}
    </div>
  );
}

const StatisticsByCategory = ({ category, label, statistics }) => {
  const [selectedIdx, setSelectedIdx] = useState(null);

  const selectedStat = selectedIdx !== null ? statistics[selectedIdx] : null;
  const percent = selectedStat ? getPercent(selectedStat) : 0;
  const color = /* COLORS[category] ||*/ "#5678FF";

  return (
    <section
      className="stat-category-section"
      style={{
        background: "#f6fff6",
        margin: "1rem"
        // borderRight: `8px solid ${color}`,
      }}
    >
      <div className="stat-category-content">
        <div className="stat-category-title">{label}:</div>
        <ul className="stat-list">
          {statistics.map((stat, idx) => (
            <li key={idx} className="stat-list-item">
              <input
                type="checkbox"
                checked={selectedIdx === idx}
                onChange={() => setSelectedIdx(idx === selectedIdx ? null : idx)}
                id={`stat-${category}-${idx}`}
              />
              <label htmlFor={`stat-${category}-${idx}`}>{stat.explanation}</label>
            </li>
          ))}
        </ul>
      </div>
      <div className="stat-category-visual">
          <PercentageGrid percent={percent} color={color} />
          {selectedStat && (
            <div className="stat-percent-block">
              <div className="stat-percent-value" style={{ color }}>
                {selectedStat.percent}%
              </div>
              <div className="stat-percent-desc">{selectedStat.explanation}</div>
            </div>
          )}
      </div>
    </section>
  );
};

export default StatisticsByCategory;