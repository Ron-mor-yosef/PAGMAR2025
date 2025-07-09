import React from "react";
import "./StatisticsByCategory.css";
import SingleStatistic from "./SingleStatistic";

const StatisticsByCategory = ({ statistics, onHoverStat, hoveredIdx, onClickStat }) => {
  // Ref to the section
  const sectionRef = React.useRef(null);


  // Always set --grid-size to 20px
  React.useEffect(() => {
    document.documentElement.style.setProperty('--grid-size', `20px`);
  }, []);

  return (
    <section className="stat-category-section" ref={sectionRef}>
      {statistics.map((stat, idx) => (
        <SingleStatistic
          key={idx}
          statistic={stat}
          hovered={hoveredIdx === idx}
          onHover={() => onHoverStat(idx)}
          onLeave={() => onHoverStat(null)}
          onClick={() => onClickStat && onClickStat(idx)}
          className={hoveredIdx !== null && hoveredIdx !== idx ? 'blurred' : ''}
        />
      ))}
    </section>
  );
};

export default StatisticsByCategory;