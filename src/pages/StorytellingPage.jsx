import React, { useEffect, useState } from 'react';
import { loadCSV } from '../utils/parseCSV';
import './StorytellingPage.css';

const StorytellingPage = () => {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({ total: 0, categories: {}, emotions: {} });

  useEffect(() => {
    loadCSV('/texts_new2.csv')
      .then((rows) => {
        setData(rows);
        const catCounts = {};
        const emoCounts = {};
        rows.forEach((row) => {
          if (row['קטגוריה']) {
            row['קטגוריה']
              .split(/,|\n/)
              .map((c) => c.trim())
              .filter((c) => c)
              .forEach((cat) => {
                catCounts[cat] = (catCounts[cat] || 0) + 1;
              });
          }
          if (row['רגש']) {
            row['רגש']
              .split(/,|\n/)
              .map((e) => e.trim())
              .filter((e) => e)
              .forEach((emo) => {
                emoCounts[emo] = (emoCounts[emo] || 0) + 1;
              });
          }
        });
        setStats({ total: rows.length, categories: catCounts, emotions: emoCounts });
      })
      .catch((err) => console.error('Error loading CSV:', err));
  }, []);

  return (
    <div className="story-container">
      <header className="story-header">
        <h1 className="fadeIn">A Journey Through Emotions</h1>
        <p className="fadeIn delay-1">
          Experience the raw and powerful storytelling of human emotions.
        </p>
      </header>
      <section className="stats-section fadeIn delay-2">
        <h2>Statistics</h2>
        <p>Total stories: {stats.total}</p>
        <div className="stats-wrapper">
          <div className="stats-block">
            <h3>Categories</h3>
            <ul>
              {Object.entries(stats.categories).map(([cat, count]) => (
                <li key={cat}>
                  {cat}: {count}
                </li>
              ))}
            </ul>
          </div>
          <div className="stats-block">
            <h3>Emotions</h3>
            <ul>
              {Object.entries(stats.emotions).map(([emo, count]) => (
                <li key={emo}>
                  {emo}: {count}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section className="stories-section fadeIn delay-3">
        {data.map((row, idx) => (
          <div key={idx} className="story-card">
            <h2 className="story-title">{row['כותרת'] || 'Untitled Story'}</h2>
            <p className="story-author">
              <strong>By:</strong> {row['שם כותבת']}
            </p>
            <div className="story-text" dangerouslySetInnerHTML={{ __html: row['הטקסט'] }} />
          </div>
        ))}
      </section>
    </div>
  );
};

export default StorytellingPage;