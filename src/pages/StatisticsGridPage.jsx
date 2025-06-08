import React, { useEffect, useState } from 'react';
import { loadCSV } from '../utils/parseCSV';
import './StatisticsGridPage.css';

const GRID_SIZE = 35;
const TOTAL_SQUARES = GRID_SIZE * GRID_SIZE;

const StatisticsGridPage = () => {
  const [stats, setStats] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(null);

  useEffect(() => {
    loadCSV('/statistics.csv').then((data) => {
      const parsed = data.map((row) => {
        const percent = parseFloat((row['אחוזים'] || '0').replace('%', '').trim());
        return {
          ...row,
          percent,
          squares: Math.round((percent / 100) * TOTAL_SQUARES),
        };
      });
      setStats(parsed);
    });
  }, []);

  const coloredCount = selectedIdx !== null ? stats[selectedIdx]?.squares || 0 : 0;

  // Group stats by sub-category
  const groupedStats = stats.reduce((acc, row, idx) => {
    const sub = row['קטגוריה'] || 'ללא קבוצה';
    if (!acc[sub]) acc[sub] = [];
    acc[sub].push({ ...row, idx });
    return acc;
  }, {});

  return (
    <div className="statistics-grid-page">
      <div className="statistics-grid-center">
        <div className="statistics-grid-table">
          {Array.from({ length: TOTAL_SQUARES }).map((_, i) => (
            <div
              key={i}
              className={`statistics-grid-cell${i < coloredCount ? ' filled' : ''}`}
            />
          ))}
        </div>
        {selectedIdx !== null && stats[selectedIdx] && (
          <div className="statistics-grid-caption">
            <span className="statistics-grid-percent">{stats[selectedIdx]['אחוזים']}</span>
            <span className="statistics-grid-caption-text">{stats[selectedIdx]['הסבר']}</span>
          </div>
        )}
      </div>
      <div className="statistics-grid-list">
        {Object.entries(groupedStats).map(([sub, items]) => (
          <div key={sub} className="statistics-grid-group">
            <div className="statistics-grid-group-title">{sub}</div>
            <ul className="statistics-grid-ul">
              {items.map((row) => (
                <li
                  key={row.idx}
                  className={`statistics-grid-li${selectedIdx === row.idx ? ' selected' : ''}`}
                  onClick={() => setSelectedIdx(row.idx)}
                >
                  <input
                    type="radio"
                    checked={selectedIdx === row.idx}
                    readOnly
                    className="statistics-grid-radio"
                  />
                  <span className="statistics-grid-li-percent">{row['אחוזים']}</span>
                  <span className="statistics-grid-li-text">{row['הסבר']}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatisticsGridPage;