// // import React, { useState } from "react";
// // import "./StatisticsByCategory.css";

// // function getPercent(stat) {
// //   return Number(stat.percent);
// // }

// // function PercentageGrid({ percent, color }) {
// //   const total = 100;
// //   const filled = Math.round((percent / 100) * total);

// //   return (
// //     <div className="percent-grid-bg">
// //       <div className="percent-grid-overlay">
// //         {[...Array(total)].map((_, i) => (
// //           <div
// //             key={i}
// //             className="percent-cell"
// //             style={{
// //               background: i < filled ? color : "transparent",
// //               opacity: i < filled ? 0.8 : 0.2,
// //             }}
// //           />
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }

// // const StatisticsByCategory = ({ category, label, statistics }) => {
// //   const [selectedIdx, setSelectedIdx] = useState(null);

// //   const selectedStat = selectedIdx !== null ? statistics[selectedIdx] : null;
// //   const percent = selectedStat ? getPercent(selectedStat) : 0;
// //   const color = "#5678FF";

// //   return (
// //     <section className="stat-category-section">
// //       <div className="stat-category-grid">
// //         {/* Left: Statistic label */}
// //         <div className="stat-category-left">
// //           {selectedStat ? (
// //             <>
// //               <div className="stat-percent-value" style={{ color }}>
// //                 {selectedStat.percent}%
// //               </div>
// //               <div className="stat-percent-desc">{selectedStat.explanation}</div>
// //             </>
// //           ) : (
// //             <div className="stat-category-title">{label}</div>
// //           )}
// //         </div>
// //         {/* Center: 10x10 grid */}
// //         <div className="stat-category-center">
// //           <PercentageGrid percent={percent} color={color} />
// //         </div>
// //         {/* Right: Checkboxes */}
// //         <div className="stat-category-right">
// //           <ul className="stat-list">
// //             {statistics.map((stat, idx) => (
// //               <li key={idx} className="stat-list-item">
// //                 <input
// //                   type="checkbox"
// //                   checked={selectedIdx === idx}
// //                   onChange={() => setSelectedIdx(idx === selectedIdx ? null : idx)}
// //                   id={`stat-${category}-${idx}`}
// //                 />
// //                 <label htmlFor={`stat-${category}-${idx}`}>{stat.explanation}</label>
// //               </li>
// //             ))}
// //           </ul>
// //         </div>
// //       </div>
// //     </section>
// //   );
// // };

// // export default StatisticsByCategory;

// import React, { useState, useRef, useEffect } from "react";
// import "./StatisticsByCategory.css";


// function getPercent(stat) {
//   return Number(stat.percent);
// }

// function PercentageGrid({ percent, color }) {
//   const total = 100;
//   const filled = Math.round((percent / 100) * total);

//   return (
//     <div className="percent-grid-bg">
//       <div className="percent-grid-overlay">
//         {[...Array(total)].map((_, i) => (
//           <div
//             key={i}
//             className="percent-cell"
//             style={{
//               background: i < filled ? color : "transparent",
//               opacity: i < filled ? 0.8 : 0.2,
//             }}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// const GRID_SIZE = 20; // px

// const StatisticsByCategory = ({ category, label, statistics }) => {
//   const [selectedIdx, setSelectedIdx] = useState(null);
//   const centerRef = useRef(null);

//   // Align the grid horizontally to the nearest grid line
//   useEffect(() => {
//     function alignGrid() {
//       if (centerRef.current) {
//         const rect = centerRef.current.getBoundingClientRect();
//         const left = rect.left + window.scrollX;
//         const offset = left % GRID_SIZE;
//         centerRef.current.style.transform = `translateX(${-offset}px)`;
//       }
//     }
//     alignGrid();
//     window.addEventListener("resize", alignGrid);
//     return () => window.removeEventListener("resize", alignGrid);
//   }, []);

//   const selectedStat = selectedIdx !== null ? statistics[selectedIdx] : null;
//   const percent = selectedStat ? getPercent(selectedStat) : 0;
//   const color = "#5678FF";

//   return (
//     <section className="stat-category-section">
//       <div className="stat-category-grid">
//         {/* Left: Statistic label */}
//         <div className="stat-category-left">
//           {selectedStat ? (
//             <>
//               <div className="stat-percent-value" style={{ color }}>
//                 {selectedStat.percent}%
//               </div>
//               <div className="stat-percent-desc">{selectedStat.explanation}</div>
//             </>
//           ) : null}
//         </div>
//         {/* Center: 10x10 grid */}
//         <div className="stat-category-center" ref={centerRef}>
//           <PercentageGrid percent={percent} color={color} />
//         </div>
//         {/* Right: Checkboxes */}
//         <div className="stat-category-right">
//           <div className="stat-category-title">{label}</div>

//           <ul className="stat-list">
//             {statistics.map((stat, idx) => (
//               <li key={idx} className="stat-list-item">
//                 <label className="custom-checkbox-label">
//                   <input
//                     type="checkbox"
//                     checked={selectedIdx === idx}
//                     onChange={() => setSelectedIdx(idx === selectedIdx ? null : idx)}
//                     id={`stat-${category}-${idx}`}
//                   />
//                   <span className="custom-checkbox-svg">
//                     {selectedIdx === idx ? (
//                       // Checked SVG
//                       <svg width="20" height="20" viewBox="0 0 20 20">
//                         <rect width="20" height="20" rx="4" fill="#5678FF" />
//                         <polyline points="5,11 9,15 15,7" fill="none" stroke="#fff" strokeWidth="2" />
//                       </svg>
//                     ) : (
//                       // Unchecked SVG
//                       <svg width="20" height="20" viewBox="0 0 20 20">
//                         <rect width="20" height="20" rx="4" fill="#fff" stroke="#5678FF" strokeWidth="2" />
//                       </svg>
//                     )}
//                   </span>
//                   <span>{stat.explanation}</span>
//                 </label>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default StatisticsByCategory;

import React, { useState } from "react";
import "./StatisticsByCategory.css";

function getPercent(stat) {
  return Number(stat.percent);
}

function getFilledGridBackground(percent, color, gridSize = 20) {
  const total = 100;
  const filled = Math.round((percent / 100) * total);
  const layers = [];

  for (let i = 0; i < filled; i++) {
    const row = Math.floor(i / 10);
    const col = i % 10;
    layers.push(
      `linear-gradient(${color}80 0 0) no-repeat ${col * gridSize}px ${row * gridSize}px / ${gridSize}px ${gridSize}px`
    );
  }

  return layers.join(", ");
}

const GRID_SIZE = 15; // px

const StatisticsByCategory = ({ category, label, statistics }) => {
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
        background: sectionBg,
        backgroundSize: `${GRID_SIZE*10}px ${GRID_SIZE*10}px, ${GRID_SIZE}px ${GRID_SIZE}px, ${GRID_SIZE}px ${GRID_SIZE}px`,
        backgroundRepeat: "no-repeat, repeat, repeat",
        backgroundPosition: `center center, left top, left top`,
      }}
    >
      <div className="stat-category-grid">
        {/* Left: Statistic label */}
        <div className="stat-category-left">
          {selectedStat ? (
            <>
              <div className="stat-percent-value" style={{ color }}>
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
          width: `calc(${GRID_SIZE}px * 10)`,
          height: `calc(${GRID_SIZE}px * 10)`,
        }} />
        {/* Right: Checkboxes */}
        <div className="stat-category-right">
          <ul className="stat-list">
            <div className="stat-category-title">{label}
            {statistics.map((stat, idx) => (
              <li key={idx} className="stat-list-item">
                <label className="custom-checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedIdx === idx}
                    onChange={() => setSelectedIdx(idx === selectedIdx ? null : idx)}
                    id={`stat-${category}-${idx}`}
                  />
                  <span className="custom-checkbox-svg">
                    {selectedIdx === idx ? (
                      // Checked SVG
                      <svg width="20" height="20" viewBox="0 0 20 20">
                        <rect width="20" height="20" rx="4" fill="#5678FF"/>
                        <polyline points="5,11 9,15 15,7" fill="none" stroke="#fff" strokeWidth="2"/>
                      </svg>
                    ) : (
                      // Unchecked SVG
                      <svg width="20" height="20" viewBox="0 0 20 20">
                        <rect width="20" height="20" rx="4" fill="#fff" stroke="#5678FF" strokeWidth="2"/>
                      </svg>
                    )}
                  </span>
                  <span>{stat.explanation}</span>
                </label>
              </li>
            ))}
            </div>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default StatisticsByCategory;