import React, { useEffect, useState } from "react";
import StatisticsByCategory from "../components/StatisticsByCategory";
import "./StatisticsPage.css";
import { loadCSV } from "../utils/parseCSV";

const CATEGORY_LABELS = {
    "נפש": "מצב נפשי",
    "גוף": "מצב גופני",
    "זוגיות": "מצב זוגי",
    "ילדים": "מצב ילדים",
    "תעסוקה": "מצב תעסוקתי",
};

const CATEGORY_ORDER = ["נפש", "גוף", "זוגיות", "ילדים", "תעסוקה"];

function parseCSV(table) {
    const parsedTable = {};

    for (let r = 0; r < table.length; r++) {
        const row = table[r];
        const explanation = row['הסבר'] || '';
        const rawPercent = row['אחוזים'] || '0%';
        const category = row['קטגוריה'] || 'אחר';
        const percent = parseFloat(rawPercent.replace('%', '').trim());

        if (isNaN(percent)) continue;

        const parsedRow = { explanation, percent }
        if (parsedTable[category]) {
            parsedTable[category].push(parsedRow)
        } else {
            parsedTable[category] = [parsedRow];
        }

    }
    return parsedTable;
}

const StatisticsPage = () => {
    const [statsByCategory, setStatsByCategory] = useState({});

    useEffect(() => {
        loadCSV("/statistics.csv").then((table) => {
            
                setStatsByCategory(parseCSV(table));
            });
    }, []);

    return (
        <main className="statistics-page">
            {CATEGORY_ORDER.filter((cat) => statsByCategory[cat]).map((cat) => (
                <StatisticsByCategory
                    key={cat}
                    category={cat}
                    label={CATEGORY_LABELS[cat] || cat}
                    statistics={statsByCategory[cat]}
                />
            ))}
        </main>
    );
};

export default StatisticsPage;