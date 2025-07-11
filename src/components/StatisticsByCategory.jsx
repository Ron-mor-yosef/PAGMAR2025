import React from "react";
import "./StatisticsByCategory.css";
import SingleStatistic from "./SingleStatistic";

const StatisticsByCategory = ({ statistics, onHoverStat, hoveredIdx, onClickStat }) => {
  // Ref to the section
  const sectionRef = React.useRef(null);
  const [oddMargin, setOddMargin] = React.useState(false);

  // Always set --grid-size to 20px
  React.useEffect(() => {
    document.documentElement.style.setProperty('--grid-size', `20px`);
  }, []);

  // Check parent width and set oddMargin
  React.useEffect(() => {
    function checkOddMargin() {
      if (!sectionRef.current || !sectionRef.current.parentElement) return;
      const parentWidth = sectionRef.current.parentElement.offsetWidth;
      const gridSize = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--grid-size'));
      if (!gridSize) return;
      const ratio = parentWidth / gridSize;
      setOddMargin(Math.round(ratio) % 2 === 1);
    }
    checkOddMargin();
    window.addEventListener('resize', checkOddMargin);
    return () => window.removeEventListener('resize', checkOddMargin);
  }, []);

  return (
    <section
      className={"stat-category-section" + (oddMargin ? " odd-margin" : "")}
      ref={sectionRef}
    >
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