import React, { useState } from "react";
import "./StatisticsByCategory.css";
import SingleStatistic from "./SingleStatistic";

const StatisticsByCategory = ({ statistics, onHoverStat, hoveredIdx, onClickStat }) => {
  return (
    <section className="stat-category-section">
      {statistics.map((stat, idx) => (
        <SingleStatistic
          key={idx}
          statistic={stat}
          hovered={hoveredIdx === idx}
          onHover={() => onHoverStat(idx)}
          onLeave={() => onHoverStat(null)}
          onClick={() => onClickStat && onClickStat(idx)}
        />
      ))}
    </section>
  );
};

export default StatisticsByCategory;